// content-core.js — 主入口、初始化、消息监听、与 background 通信
// 拆分自原 content.js 的入口逻辑
// ⚠️ 本文件将替换原 content.js，请确认无误后删除原文件
/**
 * DeepSeek Assistant - content-core.js
 * 核心骨架：初始化、消息路由、对话框、消息跳转、设置加载等
 * 依赖：所有其他模块（通过 window.__DS__）
 */
var lang = (typeof DS !== 'undefined' && DS.settings && DS.settings.preferredLanguage) || 'zh';

(function() {
  const DS = window.__DS__ = window.__DS__ || {};

  // ==================== 常量 ====================
  const PANEL_ID = 'ds-assistant-panel-iframe';
  const PANEL_OVERLAY_ID = 'ds-assistant-overlay';
  const FLOAT_BTN_ID = 'ds-assistant-float-btn';
  const STORAGE_PREFIX = 'ds_assistant_';
  const ABOUT_OVERLAY_ID = 'ds-about-overlay';

  // ==================== 状态 ====================
  const panelIframeObj = { ref: null };
  DS.panelIframeObj = panelIframeObj;
  const dragStateRef = { ref: null };
  let settings = {
    theme: 'deep-blue',
    fontSize: 'medium',
    enableFloatButton: true,
    maxHistoryItems: 50,
    customThemeColors: null
  };
  DS.settings = settings;
  let aboutOverlay = null;

  // ==================== 初始化 ====================
  function init() {
    const oldIframe = document.getElementById(PANEL_ID);
    if (oldIframe) oldIframe.remove();
    const oldOverlay = document.getElementById(PANEL_OVERLAY_ID);
    if (oldOverlay) oldOverlay.remove();
    const oldFloat = document.getElementById(FLOAT_BTN_ID);
    if (oldFloat) oldFloat.remove();
    const oldToast = document.getElementById('ds-assistant-toast-container');
    if (oldToast) oldToast.remove();

    loadSettings().then(() => {
      DS.injectFloatButton(FLOAT_BTN_ID);
      DS.updateFloatBtnBookmarkState();
      DS.injectPanelIframe(PANEL_ID, PANEL_OVERLAY_ID, panelIframeObj, () => DS.hidePanel(panelIframeObj.ref, resetDragTransform, PANEL_OVERLAY_ID));
      setupMessageListener();
      setupKeyboardShortcuts();
      DS.initMessageBookmarkSystem();
      setTimeout(() => sendContentReady(), 100);
      checkMessageScrollHash();
    });

    // 监听 storage 变化，实时更新悬浮按钮状态
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local' && changes.bookmarks) {
        DS.updateFloatBtnBookmarkState();
      }
    });

    // 监听 storage 变化，实时更新悬浮按钮状态
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local' && changes.bookmarks) {
        DS.updateFloatBtnBookmarkState();
      }
    });

    window.addEventListener('beforeunload', cleanup);
  }

  function cleanup() {
    const ids = [PANEL_ID, PANEL_OVERLAY_ID, FLOAT_BTN_ID, 'ds-assistant-toast-container'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
    panelIframeObj.ref = null;
    DS.floatBtn = null;
  }

  // ==================== 设置加载 ====================
  async function loadSettings() {
    try {
      const stored = await chrome.storage.local.get([
        STORAGE_PREFIX + 'theme',
        STORAGE_PREFIX + 'fontSize',
        STORAGE_PREFIX + 'enableFloatButton',
        STORAGE_PREFIX + 'maxHistoryItems',
        STORAGE_PREFIX + 'customThemeColors'
      ]);
      if (stored[STORAGE_PREFIX + 'theme'] !== undefined) settings.theme = stored[STORAGE_PREFIX + 'theme'];
      if (stored[STORAGE_PREFIX + 'fontSize'] !== undefined) settings.fontSize = stored[STORAGE_PREFIX + 'fontSize'];
      if (stored[STORAGE_PREFIX + 'enableFloatButton'] !== undefined) settings.enableFloatButton = stored[STORAGE_PREFIX + 'enableFloatButton'];
      if (stored[STORAGE_PREFIX + 'maxHistoryItems'] !== undefined) settings.maxHistoryItems = stored[STORAGE_PREFIX + 'maxHistoryItems'];
      if (stored[STORAGE_PREFIX + 'customThemeColors'] !== undefined) settings.customThemeColors = stored[STORAGE_PREFIX + 'customThemeColors'];
    } catch (e) {
      console.warn('[DeepSeek-Assistant] Failed to load settings:', e);
    }
  }

  // ==================== 消息监听 ====================
  function setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      (async () => {
        try {
          switch (message.action) {
            case 'toggle-panel':
              DS.togglePanel(panelIframeObj.ref,
                () => DS.hidePanel(panelIframeObj.ref, resetDragTransform, PANEL_OVERLAY_ID),
                () => DS.showPanel(panelIframeObj.ref, DS.floatBtn, sendContentReady, PANEL_OVERLAY_ID));
              sendResponse({ success: true });
              break;
            case 'get-panel-state':
              sendResponse({ visible: panelIframeObj.ref ? panelIframeObj.ref.classList.contains('visible') : false });
              break;
            case 'fetch-sidebar-conversations':
              const conversations = await DS.fetchSidebarConversations();
              sendResponse({ success: true, conversations });
              break;
            case 'search-current-page':
              const results = DS.searchCurrentPage(message.query);
              sendResponse({ success: true, results });
              break;
            case 'scroll-to-result':
              DS.scrollToResult(message.index);
              sendResponse({ success: true });
              break;
            case 'get-page-title':
              sendResponse({ title: DS.getPageTitle() });
              break;
            case 'open-url':
              window.open(message.url, '_blank');
              sendResponse({ success: true });
              break;
            case 'settings-changed':
              Object.assign(settings, message.settings);
              // 同步更新全局 lang 变量，确保所有弹窗和提示立即切换语言
              lang = (settings.preferredLanguage) || 'zh';
              DS.updateFloatButtonVisibility();
              sendResponse({ success: true });
              break;
            case 'close-panel':
              DS.hidePanel(panelIframeObj.ref, resetDragTransform, PANEL_OVERLAY_ID);
              sendResponse({ success: true });
              break;
            case 'minimize-panel':
              DS.hidePanel(panelIframeObj.ref, resetDragTransform, PANEL_OVERLAY_ID);
              sendResponse({ success: true });
              break;
            case 'toggle-float-btn':
              settings.enableFloatButton = message.enabled;
              DS.updateFloatButtonVisibility();
              sendResponse({ success: true });
              break;
            case 'open-about-overlay':
              openAboutOverlay();
              sendResponse({ success: true });
              break;
            case 'close-about-overlay':
              closeAboutOverlay();
              sendResponse({ success: true });
              break;
            case 'toggle-bookmark':
              DS.bookmarkCurrentPage();
              sendResponse({ success: true });
              break;
            case 'bookmark-from-panel':
              if (message.title) {
                DS.bookmarkConversation(message.title, message.url || window.location.href, message.snippet || '');
              } else {
                DS.bookmarkCurrentPage();
              }
              sendResponse({ success: true });
              break;
            case 'quick-bookmark':
              (async () => {
                const title = await DS.getTrustedTitle();
                const url = window.location.href;
                const snippet = DS.getPageSnippet();
                await DS.bookmarkConversation(title, url, snippet, '');
              })();
              sendResponse({ success: true });
              break;
            default:
              sendResponse({ success: false, error: 'Unknown action' });
          }
        } catch (e) {
          sendResponse({ success: false, error: e.message });
        }
      })();
      return true;
    });

    window.addEventListener('message', (event) => {
      if (!event.data || !event.data.action) return;
      if (event.data.action === 'reset-panel-position') {
        resetDragTransform(panelIframeObj.ref, dragStateRef);
        chrome.storage.local.get(['panel_positions'], (result) => {
          const positions = result['panel_positions'] || {};
          delete positions[window.location.href];
          chrome.storage.local.set({ panel_positions: positions });
          chrome.storage.local.set({ panel_size: 'original' });
          if (panelIframeObj.ref) { panelIframeObj.ref.style.width = '432px'; panelIframeObj.ref.style.height = '88vh'; }
        });
      }
      if (event.data.action === 'minimize-panel') { DS.hidePanel(panelIframeObj.ref, resetDragTransform, PANEL_OVERLAY_ID); if (DS.floatBtn) DS.floatBtn.classList.add('panel-minimized'); }
      if (event.data.action === 'close-panel') DS.hidePanel(panelIframeObj.ref, resetDragTransform, PANEL_OVERLAY_ID);
      if (event.data.action === 'drag-start') DS.startDrag(panelIframeObj.ref, event.data.offsetX, event.data.offsetY, dragStateRef, DS.savePanelPosition);
      if (event.data.action === 'close-about-overlay') closeAboutOverlay();
    });
  }

  // ==================== 键盘快捷键 ====================
  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panelIframeObj.ref && panelIframeObj.ref.classList.contains('visible')) {
        DS.hidePanel(panelIframeObj.ref, resetDragTransform, PANEL_OVERLAY_ID);
      }
    });
  }

  function resetDragTransform(panelIframe, dragStateRef) {
    if (dragStateRef.ref) {
      document.removeEventListener('mousemove', dragStateRef.ref.onMouseMove);
      document.removeEventListener('mouseup', dragStateRef.ref.onMouseUp);
      dragStateRef.ref = null;
    }
    if (panelIframe) {
      panelIframe.style.left = '';
      panelIframe.style.top = '';
      panelIframe.style.transform = 'translate(-50%, -50%) scale(0.9)';
    }
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }

  // ==================== 通知 panel 就绪信号 ====================
  function sendContentReady() {
    if (panelIframeObj.ref && panelIframeObj.ref.contentWindow) {
      try {
        panelIframeObj.ref.contentWindow.postMessage({ action: 'content-ready' }, '*');
      } catch (e) {}
    }
  }

  // ==================== 确认对话框 ===================
  function showConfirmDialog(title, message, onConfirm, onCancel) {
    const overlay = document.createElement('div');
    overlay.className = 'ds-confirm-overlay';
    overlay.style.cssText = [
      'position: fixed;',
      'inset: 0;',
      'background: rgba(0,0,0,0.5);',
      'z-index: 2147483648;',
      'display: flex;',
      'align-items: center;',
      'justify-content: center;',
      'animation: dsFadeIn 0.15s ease;'
    ].join('');

    const dialog = document.createElement('div');
    dialog.style.cssText = [
      'background: #fff;',
      'border-radius: 14px;',
      'box-shadow: 0 12px 48px rgba(0,0,0,0.25);',
      'padding: 24px;',
      'max-width: 380px;',
      'width: 90%;',
      'animation: dsScaleIn 0.2s ease;'
    ].join('');

    dialog.innerHTML = [
      '<h3 style="margin:0 0 8px;font-size:16px;font-weight:600;color:#333;">' + DS.escapeHTML(title) + '</h3>',
      '<p style="margin:0 0 20px;font-size:13px;color:#666;line-height:1.6;">' + DS.escapeHTML(message) + '</p>',
      '<div style="display:flex;justify-content:flex-end;gap:8px;">',
        '<button class="ds-confirm-cancel" style="padding:8px 16px;border:1px solid #dadce0;border-radius:8px;background:#fff;color:#333;cursor:pointer;font-size:13px;">' + (lang === 'en' ? 'Cancel' : '取消') + '</button>',
        '<button class="ds-confirm-ok" style="padding:8px 16px;border:none;border-radius:8px;background:#1890ff;color:#fff;cursor:pointer;font-size:13px;">' + (lang === 'en' ? 'Yes' : '是') + '</button>',
      '</div>'
    ].join('');

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    const cleanup = () => { overlay.remove(); };
    dialog.querySelector('.ds-confirm-ok').addEventListener('click', () => { cleanup(); if (onConfirm) onConfirm(); });
    dialog.querySelector('.ds-confirm-cancel').addEventListener('click', () => { cleanup(); if (onCancel) onCancel(); });
    overlay.addEventListener('click', (e) => { if (e.target === overlay) { cleanup(); if (onCancel) onCancel(); } });
  }

  // ==================== 关于覆盖层 ====================
  function openAboutOverlay() {
    if (document.getElementById(ABOUT_OVERLAY_ID)) return;

    const overlay = document.createElement('div');
    overlay.id = ABOUT_OVERLAY_ID;
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.4);z-index:2147483646;display:flex;align-items:center;justify-content:center;';

    const dialog = document.createElement('div');
    dialog.style.cssText = 'width:480px;max-width:90vw;height:80vh;max-height:88vh;background:#fff;border-radius:14px;box-shadow:0 12px 48px rgba(0,0,0,0.25);overflow:hidden;display:flex;flex-direction:column;';
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) dialog.style.background = '#1e1e1e';

    const iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('about.html');
    iframe.style.cssText = 'width:100%;height:100%;border:none;';
    dialog.appendChild(iframe);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    aboutOverlay = overlay;

    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeAboutOverlay(); });
    const esc = (e) => { if (e.key === 'Escape') { closeAboutOverlay(); document.removeEventListener('keydown', esc); } };
    document.addEventListener('keydown', esc);
  }

  function closeAboutOverlay() {
    const el = document.getElementById(ABOUT_OVERLAY_ID);
    if (el) { el.remove(); aboutOverlay = null; }
  }

  // ==================== 消息收藏跳转定位 ====================
  function checkMessageScrollHash() {
    var hash = window.location.hash;
    if (!hash || hash.indexOf('ds-msg=') === -1) return;
    var messageIdRaw = hash.match(/ds-msg=([^&]+)/);
    if (!messageIdRaw) return;
    var messageId = decodeURIComponent(messageIdRaw[1]);
    var capturedId = messageId;

    chrome.storage.local.get(['messageBookmarks'], function (result) {
      if (chrome.runtime.lastError) return;
      var bookmarks = result.messageBookmarks || [];
      var target = bookmarks.find(b => b.id === capturedId);
      if (!target) { DS.showToast(lang === 'en' ? '⚠️ Bookmarked message not found' : '⚠️ 未找到该收藏消息'); return; }

      if (target.sharedLink) {
        var targetBase = target.sharedLink.split('#')[0];
        var currentBase = window.location.href.split('#')[0];
        if (targetBase !== currentBase) { window.location.href = target.sharedLink; return; }
      }
      waitForMessageElement(target, 0);
    });
  }

  function waitForMessageElement(target, attempt) {
    if (attempt >= 25) {
      var convLink = document.querySelector('a[href*="/chat/"]');
      if (convLink) {
        var href = convLink.getAttribute('href');
        var fullUrl = href.startsWith('http') ? href : window.location.origin + (href || window.location.pathname);
        DS.showToast(lang === 'en' ? '📌 Message not loaded, opening conversation...' : '📌 消息未加载，正在为您打开对应对话...');
        setTimeout(() => { window.location.href = fullUrl; }, 1500);
      } else {
        DS.showToast(lang === 'en' ? '🔍 Message not found' : '🔍 未找到该消息');
      }
      return;
    }

    var el = findMessageElement(target.contentText, target.messageRole);
    if (el) {
      scrollToAndHighlight(el);
      return;
    }

    var scrollContainer = document.querySelector('._765a5cd')
      || document.querySelector('[class*="ds-scroll-area"]')
      || document.querySelector('._7780f2e');

    if (scrollContainer && scrollContainer.scrollHeight > scrollContainer.clientHeight) {
      scrollContainer.scrollTop = Math.max(0, scrollContainer.scrollTop - 1200);
    } else {
      var fallback = DS.findScrollableContainer();
      if (fallback && fallback !== window) fallback.scrollTop = Math.max(0, fallback.scrollTop - 1200);
      else window.scrollTo(0, Math.max(0, window.scrollY - 1200));
    }

    setTimeout(() => waitForMessageElement(target, attempt + 1), 800);
  }

  function findMessageElement(contentText, messageRole) {
    var messages = document.querySelectorAll('.ds-message');
    var searchText = (contentText || '').trim().slice(0, 200);
    if (!searchText) return null;

    for (var i = 0; i < messages.length; i++) {
      var el = messages[i];
      if (DS.detectMessageRole(el) !== messageRole) continue;
      var elText = (el.textContent || '').trim();
      if (elText.indexOf(searchText) !== -1 || (searchText.length >= 100 && elText.indexOf(searchText.slice(0, 100)) !== -1)) {
        return el;
      }
    }
    return null;
  }

  function scrollToAndHighlight(el) {
    var origScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    var interrupted = false;
    var interruptHandler = () => { interrupted = true; };
    document.addEventListener('wheel', interruptHandler, { once: true, passive: true });
    document.addEventListener('touchstart', interruptHandler, { once: true, passive: true });
    document.addEventListener('keydown', interruptHandler, { once: true });

    el.scrollIntoView({ behavior: 'auto', block: 'center' });
    setTimeout(() => { document.documentElement.style.scrollBehavior = origScrollBehavior; }, 60);

    if (interrupted) return;

    var origOutline = el.style.outline, origOffset = el.style.outlineOffset, origBoxShadow = el.style.boxShadow, origTransition = el.style.transition;
    el.style.transition = 'outline 0.15s ease, box-shadow 0.15s ease';
    var toggle = 0;
    var blink = setInterval(() => {
      if (interrupted) {
        clearInterval(blink);
        el.style.outline = origOutline || '';
        el.style.outlineOffset = origOffset || '';
        el.style.boxShadow = origBoxShadow || '';
        el.style.transition = origTransition || '';
        return;
      }
      if (toggle % 2 === 0) { el.style.outline = '3px solid #ff4d4f'; el.style.outlineOffset = '3px'; el.style.boxShadow = '0 0 14px rgba(255,77,79,0.55)'; }
      else { el.style.outline = origOutline || ''; el.style.outlineOffset = origOffset || ''; el.style.boxShadow = origBoxShadow || ''; }
      toggle++;
      if (toggle >= 6) {
        clearInterval(blink);
        el.style.outline = origOutline || '';
        el.style.outlineOffset = origOffset || '';
        el.style.boxShadow = origBoxShadow || '';
        el.style.transition = origTransition || '';
        DS.showToast(lang === 'en' ? '📍 Message located' : '📍 已定位到收藏消息');
      }
    }, 350);
  }

  // ==================== 挂载到 DS ====================
  DS.init = init;
  DS.showConfirmDialog = showConfirmDialog;
  DS.sendContentReady = sendContentReady;

  // 自启动
  init();

})();