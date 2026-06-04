// ============================================================
// background.js — DeepSeek助手 后台 Service Worker
// 职责：注册快捷键命令、中转消息、管理面板生命周期
// ============================================================

// ---------- 快捷键监听 ----------
chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-panel') {
    togglePanel();
  }
  if (command === 'toggle-bookmark') {
    triggerBookmark();
  }
});

// ---------- 点击扩展图标也可以切换面板 ----------
chrome.action.onClicked.addListener((tab) => {
  togglePanel();
});

// ---------- 核心：切换面板显示/隐藏 ----------
async function togglePanel() {
  const tab = await getDeepSeekTab();
  if (!tab) return;

  try {
    await chrome.tabs.sendMessage(tab.id, { action: 'toggle-panel' });
  } catch {
    // content.js 未注入或上下文失效 → 重新注入
    // 新版 content.js 的 init() 会自动先清理旧 DOM 再创建新的
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ['content.css']
    });
    setTimeout(() => {
      chrome.tabs.sendMessage(tab.id, { action: 'toggle-panel' }).catch(() => {});
    }, 300);
  }
}

// ---------- 获取当前 DeepSeek 标签页（辅助函数） ----------
async function getDeepSeekTab() {
  const tabs = await chrome.tabs.query({ url: 'https://chat.deepseek.com/*' });
  if (tabs.length > 0) {
    const activeTabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeDS = activeTabs.find(t => t.url && t.url.startsWith('https://chat.deepseek.com'));
    if (activeDS) return activeDS;
    return tabs[0];
  }
  return null;
}

// ---------- 向当前 DeepSeek 标签页的 content.js 发送消息 ----------
async function sendToContent(action, payload = {}) {
  const tab = await getDeepSeekTab();
  if (!tab) return { success: false, error: '非DeepSeek页面' };
  try {
    return await chrome.tabs.sendMessage(tab.id, { action, ...payload });
  } catch {
    return { success: false, error: 'content.js 未响应' };
  }
}

// ---------- 快捷键触发收藏（Ctrl+Shift+X）----------
// ★ 终结修复：不再依赖 content.js 消息往返（document.title 可能已被侧边栏 SPA 污染），
// 直接从 getDeepSeekTab() 获取标签页真实 title/url 直写 chrome.storage.local。
async function triggerBookmark() {
  const tab = await getDeepSeekTab();
  if (!tab) {
    console.warn('[DeepSeek-Assistant][triggerBookmark] 未找到 DeepSeek 标签页');
    return;
  }
  console.log('[DeepSeek-Assistant][triggerBookmark] 快捷键触发收藏');

  try {
    await chrome.tabs.sendMessage(tab.id, { action: 'quick-bookmark' });
    console.log('[DeepSeek-Assistant][triggerBookmark] 快捷收藏消息已发送');
  } catch {
    // content.js 不可用时降级：直接写入 storage 并向面板发送通知
    console.warn('[DeepSeek-Assistant][triggerBookmark] content.js 不可用，降级存储');
    const safeTitle = (tab.title || '').replace(/\s*[-–—|]\s*DeepSeek.*$/i, '').trim() || '未命名对话';
    const safeUrl = tab.url || '';
    try {
      const result = await chrome.storage.local.get('bookmarks');
      const bookmarks = result['bookmarks'] || [];
      const exists = bookmarks.some(b => b.url && b.url === safeUrl);
      if (exists) return;
      const bookmark = {
        title: safeTitle.slice(0, 100),
        url: safeUrl,
        snippet: '',
        note: '',
        timestamp: Date.now(),
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      bookmarks.unshift(bookmark);
      await chrome.storage.local.set({ bookmarks });
      // 尝试通知面板刷新
      chrome.runtime.sendMessage({ action: 'bookmark-updated' }).catch(() => {});
    } catch (e) {
      console.error('[DeepSeek-Assistant][triggerBookmark] 降级存储失败:', e);
    }
  }
}

// ---------- 消息中转：处理来自 panel.html 和 content.js 的消息 ----------
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const { action } = message;

  switch (action) {
    // ---- 存储相关 ----
    case 'storage-set': {
      const { key, value } = message;
      chrome.storage.local.set({ [key]: value }).then(() => {
        sendResponse({ success: true });
      });
      return true;
    }


    case 'storage-get': {
      const { key } = message;
      chrome.storage.local.get(key).then((result) => {
        sendResponse({ success: true, data: result[key] });
      });
      return true;
    }

    case 'storage-get-all': {
      chrome.storage.local.get(null).then((result) => {
        sendResponse({ success: true, data: result });
      });
      return true;
    }

    case 'storage-remove': {
      const { key } = message;
      chrome.storage.local.remove(key).then(() => {
        sendResponse({ success: true });
      });
      return true;
    }

    // ---- 获取当前活动标签页信息 ----
    case 'get-active-tab': {
      chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
        sendResponse({ success: true, tab });
      });
      return true;
    }

    // ---- 面板 ← → content 消息中转 ----
    // 这些消息来自 panel.html，需要转发给 content.js

    case 'close-panel': {
      getDeepSeekTab().then((tab) => {
        if (tab) {
          chrome.tabs.sendMessage(tab.id, { action: 'close-panel' }).catch(() => {});
        }
      });
      sendResponse({ success: true });
      return false;
    }

    case 'search-current-page': {
      const { query } = message;
      sendToContent('search-current-page', { query })
        .then((res) => sendResponse(res))
        .catch(() => sendResponse({ success: false, results: [] }));
      return true;
    }

    case 'fetch-sidebar-conversations': {
      // ★ Bug1修复：中转侧边栏抓取请求
      sendToContent('fetch-sidebar-conversations')
        .then((res) => sendResponse(res))
        .catch(() => sendResponse({ success: false, conversations: [] }));
      return true;
    }

    case 'scroll-to-result': {
      const { index } = message;
      sendToContent('scroll-to-result', { index })
        .then((res) => sendResponse(res))
        .catch(() => sendResponse({ success: false }));
      return true;
    }

    case 'toggle-float-btn': {
      const { enabled } = message;
      sendToContent('toggle-float-btn', { enabled })
        .then(() => sendResponse({ success: true }))
        .catch(() => sendResponse({ success: false }));
      return true;
    }

    case 'settings-changed': {
      const { settings } = message;
      sendToContent('settings-changed', { settings })
        .then(() => sendResponse({ success: true }))
        .catch(() => sendResponse({ success: false }));
      return true;
    }

    case 'open-about-overlay': {
      sendToContent('open-about-overlay')
        .then((res) => sendResponse(res))
        .catch(() => sendResponse({ success: false }));
      return true;
    }

    case 'open-url': {
      const { url } = message;
      if (url) {
        chrome.tabs.create({ url }).then(() => {
          sendResponse({ success: true });
        }).catch(() => {
          sendResponse({ success: false, error: '无法打开URL' });
        });
      } else {
        sendResponse({ success: false, error: '缺少URL' });
      }
      return true;
    }

    // ---- ★ Bug3修复：收藏当前对话 ----
    // ★ 最终防御：所有写入 chrome.storage.local.set({ bookmarks }) 前强制覆盖
    case 'bookmark-conversation': {
      const { data } = message;
      console.log('[DeepSeek-Assistant][bg:bookmark-conversation] 收到收藏请求 | data=', JSON.stringify(data));

      (async () => {
        try {
          const result = await chrome.storage.local.get('bookmarks');
          const bookmarks = result.bookmarks || [];

          const exists = bookmarks.some(b => {
            if (b.url && data.url) return b.url === data.url;
            return b.title === data.title;
          });
          if (exists) {
            console.log('[DeepSeek-Assistant][bg:bookmark-conversation] 重复，已忽略 | title=', data.title, '| url=', data.url);
            sendResponse({ success: false, error: '该对话已在收藏夹中' });
            return;
          }

          const bookmark = {
            ...data,
            note: data.note || '',
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
          };

          bookmarks.unshift(bookmark);
          bookmarks.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

          await chrome.storage.local.set({ bookmarks });
          console.log('[DeepSeek-Assistant][bg:bookmark-conversation] 保存成功 | title=', data.title, '| url=', data.url);
          sendResponse({ success: true, bookmark });
        } catch (e) {
          console.error('[DeepSeek-Assistant][bg:bookmark-conversation] 失败:', e);
          sendResponse({ success: false, error: '存储失败' });
        }
      })();

      return true;
    }

    // ---- 面板右键收藏中转 ----
    // ★ 关键修复：不再直接存储，转发给 content.js 让 getTrustedTitle() 决定标题
    case 'bookmark-from-panel': {
      console.log('[DeepSeek-Assistant][bg:bookmark-from-panel] 收到面板收藏请求，转发到 content.js | 面板传入title=', message.data?.title, 'url=', message.data?.url);
      // 转发给当前 DeepSeek 标签页的 content.js 处理
      sendToContent('bookmark-from-panel', {
        title: message.data?.title || '',
        url: message.data?.url || '',
        snippet: message.data?.snippet || ''
      }).then((res) => {
        console.log('[DeepSeek-Assistant][bg:bookmark-from-panel] content.js 处理结果:', res);
        sendResponse({ success: true });
      }).catch(async (err) => {
        // ★ 降级修复：禁止使用 panel 传入的侧边栏数据，改为查询标签页真实数据
        console.warn('[DeepSeek-Assistant][bg:bookmark-from-panel] content.js 不可用，从标签页获取真实数据', err);
        try {
          const tab = await getDeepSeekTab();
          if (!tab) {
            sendResponse({ success: false, error: '无法获取当前标签页' });
            return;
          }
          const safeTitle = (tab.title || '').replace(/\s*[-–—|]\s*DeepSeek.*$/i, '').trim() || '未命名对话';
          const safeUrl = tab.url || window.location.href;
          const snippet = message.data?.snippet || '';
          const result = await chrome.storage.local.get('bookmarks');
          const bookmarks = result.bookmarks || [];
          const exists = bookmarks.some(b => b.url && b.url === safeUrl);
          if (exists) {
            sendResponse({ success: false, error: '该对话已在收藏夹中' });
            return;
          }
          const bookmark = {
            title: safeTitle.slice(0, 100),
            url: safeUrl,
            snippet: snippet || '',
            note: '',
            timestamp: Date.now(),
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
          };
          bookmarks.unshift(bookmark);
          await chrome.storage.local.set({ bookmarks });
          sendResponse({ success: true, bookmark });
        } catch (e) {
          console.error('[DeepSeek-Assistant][bg:bookmark-from-panel] 降级存储失败:', e);
          sendResponse({ success: false, error: '存储失败' });
        }
      });
      return true;
    }

    default:
      sendResponse({ success: false, error: '未知操作' });
      return false;
  }
});

// ---------- 匿名使用统计 ----------
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function getUserId() {
  const result = await chrome.storage.local.get('userId');
  if (result.userId) return result.userId;
  const userId = generateUUID();
  await chrome.storage.local.set({ userId });
  return userId;
}

async function pingDailyActive() {
  const today = new Date().toISOString().slice(0, 10);
  const storageKey = 'ds_last_ping_date';
  try {
    const result = await chrome.storage.local.get(storageKey);
    if (result[storageKey] === today) return;

    const userId = await getUserId();
    const manifest = chrome.runtime.getManifest();
    const platform = navigator.userAgent.includes('Edg') ? 'Edge' : 'Chrome';
    const language = navigator.language;

    await fetch('https://deepseek-assistant-stats.2246015455.workers.dev/collect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userId,
        platform: platform,
        language: language,
        version: manifest.version
      })
    });

    await chrome.storage.local.set({ [storageKey]: today });
  } catch (e) {
    // 静默处理，不影响插件核心功能
  }
}
pingDailyActive();

// ---------- chrome.alarms 保活机制（每20秒唤醒一次）----------
chrome.alarms.create('keep-alive', { periodInMinutes: 0.33 }); // ~20秒
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keep-alive') {
    console.log('[DeepSeek-Assistant] SW keep-alive');
  }
});

// ---------- 安装/更新时的初始化 ----------

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.local.set({
      settings: {
        theme: 'light',
        fontSize: 'medium',
        enableFloatButton: true,
        maxHistoryItems: 50
      },
      searchHistory: [],
      bookmarks: [],
      pluginVersion: chrome.runtime.getManifest().version
    });
  }
});