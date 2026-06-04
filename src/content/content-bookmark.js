// content-bookmark.js — 对话/消息收藏触发逻辑 + 星标按钮注入
// 拆分自原 content.js 的 bookmarkCurrentPage、handleMessageBookmark 及相关函数
// 合并对话收藏和消息收藏的页面注入逻辑，两者高度相似适合放一起
/**
 * DeepSeek Assistant - content-bookmark.js
 * 对话收藏、消息收藏系统
 * 依赖：content-utils.js (window.__DS__)
 */
var lang = (typeof DS !== 'undefined' && DS.settings && DS.settings.preferredLanguage) || 'zh';

(function() {
  const DS = window.__DS__ = window.__DS__ || {};

  DS.bookmarkCurrentPage = async function bookmarkCurrentPage() {
    const realTimeTitle = await DS.getTrustedTitle();
    const url = window.location.href;
    const snippet = DS.getPageSnippet();
    console.log('[DeepSeek-Assistant][bookmarkCurrentPage] 标题来源=getTrustedTitle | title=', realTimeTitle, '| url=', url);
    const note = prompt(lang === 'en' ? 'Enter bookmark note (optional):' : '请输入收藏备注（可选）：', '') || '';
    console.log('[DeepSeek-Assistant][bookmarkCurrentPage] 备注 note=', note);
    DS.bookmarkConversation(realTimeTitle, url, snippet, note);
  };

  DS.bookmarkConversation = async function bookmarkConversation(title, url, snippet, note) {
    const actualTitle = title || await DS.getTrustedTitle();
    const actualUrl = url || window.location.href;

    const data = {
      title: actualTitle,
      url: actualUrl,
      snippet: snippet || '',
      note: note || '',
      timestamp: Date.now()
    };

    console.log('[DeepSeek-Assistant][bookmarkConversation] 统一收藏入口 | data=', JSON.stringify(data));

    try {
      if (chrome.runtime && chrome.runtime.id) {
        const res = await chrome.runtime.sendMessage({
          action: 'bookmark-conversation',
          data
        });
        if (res && res.success) {
          DS.showToast(lang === 'en' ? '⭐ Conversation bookmarked' : '⭐ 已收藏当前对话');
          DS.markFloatBtnAsBookmarked && DS.markFloatBtnAsBookmarked();
          DS.notifyPanelRefresh();
          return;
        }
        if (res && res.error) {
          DS.showToast(lang === 'en' ? '\u26A0\uFE0F ' + res.error : '\u26A0\uFE0F ' + res.error);
          return;
        }
      }
    } catch (e) {
      console.warn('[DeepSeek-Assistant] SW unreachable, using direct storage:', e.message);
    }

    try {
      const stored = await chrome.storage.local.get(['bookmarks']);
      const bookmarks = stored['bookmarks'] || [];
      const exists = bookmarks.some(b => {
        if (b.url && data.url) return b.url === data.url;
        return b.title === data.title;
      });
      if (exists) {
        DS.showToast(lang === 'en' ? '⚠️ Conversation already bookmarked' : '⚠️ 该对话已在收藏夹中');
        return;
      }
      bookmarks.unshift({
        ...data,
        id: Date.now().toString() + '_' + Math.random().toString(36).slice(2),
        createdAt: new Date().toISOString()
      });
      await chrome.storage.local.set({ bookmarks });
      DS.showToast(lang === 'en' ? '⭐ Conversation bookmarked' : '⭐ 已收藏当前对话');
      DS.markFloatBtnAsBookmarked && DS.markFloatBtnAsBookmarked();
      DS.notifyPanelRefresh();
    } catch (e) {
      console.error('[DeepSeek-Assistant] Bookmark failed:', e);
      DS.showToast(lang === 'en' ? 'Bookmark failed' : '收藏失败');
    }
  };

  DS.notifyPanelRefresh = function notifyPanelRefresh() {
    const iframe = DS.panelIframeObj && DS.panelIframeObj.ref;
    if (iframe && iframe.contentWindow) {
      try {
        iframe.contentWindow.postMessage({ action: 'new-bookmark' }, '*');
      } catch (e) {}
    }
  };

  DS.initMessageBookmarkSystem = function initMessageBookmarkSystem() {
    DS.injectMessageBookmarkStyles();
    DS.scanExistingMessagesForBookmark();
    DS.startMessageBookmarkObserver();
  };

  DS.injectMessageBookmarkStyles = function injectMessageBookmarkStyles() {
    if (document.getElementById('ds-msg-bookmark-style')) return;
    const style = document.createElement('style');
    style.id = 'ds-msg-bookmark-style';
    style.textContent = `
.ds-msg-bookmark-btn {
  opacity: 0;
  transition: opacity 0.2s ease, color 0.2s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  font-size: 14px;
  line-height: 1;
  padding: 0;
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  color: #999;
}
.ds-message:hover .ds-msg-bookmark-btn,
.ds-assistant-message-main-content:hover .ds-msg-bookmark-btn {
  opacity: 1;
}
.ds-msg-bookmark-btn:hover {
  background: rgba(0,0,0,0.06);
  color: #f5a623;
}
.ds-msg-bookmark-btn.bookmarked {
  opacity: 1;
  color: #f5a623 !important;
}
`;
    document.head.appendChild(style);
  };

  DS.scanExistingMessagesForBookmark = function scanExistingMessagesForBookmark() {
    const messages = document.querySelectorAll('.ds-message');
    messages.forEach(DS.injectBookmarkButton);
  };

  DS.startMessageBookmarkObserver = function startMessageBookmarkObserver() {
    const targetNode = document.querySelector('._7780f2e')
      || document.querySelector('[class*="ds-virtual-list"][class*="printable"]')
      || document.querySelector('[class*="_765a5cd"]')
      || document.body;

    const observer = new MutationObserver(function(mutations) {
      var needsScan = false;
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].type === 'childList' && mutations[i].addedNodes.length > 0) {
          needsScan = true;
          break;
        }
      }
      if (needsScan) {
        requestAnimationFrame(function() {
          var newMessages = targetNode.querySelectorAll('.ds-message:not([data-bookmark-injected])');
          for (var j = 0; j < newMessages.length; j++) {
            DS.injectBookmarkButton(newMessages[j]);
          }
        });
      }
    });

    observer.observe(targetNode, { childList: true, subtree: true });
  };

  DS.injectBookmarkButton = function injectBookmarkButton(messageEl) {
    if (messageEl.getAttribute('data-bookmark-injected') === 'true') return;
    messageEl.setAttribute('data-bookmark-injected', 'true');

    if (window.getComputedStyle(messageEl).position === 'static') {
      messageEl.style.position = 'relative';
    }

    var btn = document.createElement('button');
    btn.className = 'ds-msg-bookmark-btn';
    btn.textContent = '\u2B50';
    btn.title = lang === 'en' ? 'Bookmark this message' : '收藏此消息';

    btn.addEventListener('click', async function(e) {
      e.stopPropagation();
      e.preventDefault();
      await DS.handleMessageBookmark(messageEl, btn);
    });

    messageEl.appendChild(btn);

    var aiContent = messageEl.querySelector('.ds-assistant-message-main-content');
    if (aiContent) {
      if (window.getComputedStyle(aiContent).position === 'static') {
        aiContent.style.position = 'relative';
      }
      var aiBtn = document.createElement('button');
      aiBtn.className = 'ds-msg-bookmark-btn';
      aiBtn.textContent = '\u2B50';
      aiBtn.title = lang === 'en' ? 'Bookmark this message' : '收藏此消息';
      aiBtn.style.top = 'auto';
      aiBtn.style.bottom = '8px';

      aiBtn.addEventListener('click', async function(e) {
        e.stopPropagation();
        e.preventDefault();
        await DS.handleMessageBookmark(messageEl, aiBtn);
      });

      aiContent.appendChild(aiBtn);
    }

    DS.checkBookmarkStatus(messageEl, btn);
  };

  DS.checkBookmarkStatus = async function checkBookmarkStatus(messageEl, btn) {
    try {
      var contentText = (messageEl.textContent || '').trim().slice(0, 500);
      var messageRole = DS.detectMessageRole(messageEl);
      var stored = await chrome.storage.local.get(['messageBookmarks']);
      var bookmarks = stored['messageBookmarks'] || [];
      var found = bookmarks.some(function(b) {
        return b.messageRole === messageRole && b.contentText === contentText;
      });
      if (found) {
        btn.classList.add('bookmarked');
        var bookmarkTitles = { zh: '已收藏', en: 'Bookmarked' };
        btn.title = bookmarkTitles[lang] || bookmarkTitles.zh;
      }
    } catch (e) {}
  };

  DS.handleMessageBookmark = async function handleMessageBookmark(messageEl, btn) {
    btn.disabled = true;
    try {
      var messageRole = DS.detectMessageRole(messageEl);

      let contentHTML = '';
      let contentText = '';

      if (messageRole === 'AI') {
        const aiContent = messageEl.querySelector('.ds-assistant-message-main-content');
        if (aiContent) {
          const clone = aiContent.cloneNode(true);
          clone.querySelectorAll(
            '.ds-think-content, [class*="think"], [class*="thinking"], [class*="reasoning"], ' +
            '[class*="_767406f"], [class*="e1675d8b"], [class*="_5255ff8"], [data-type="think"]'
          ).forEach(el => el.remove());
          contentHTML = clone.innerHTML;
          contentText = clone.textContent.trim();
        }
      }

      if (!contentHTML) {
        const fullMsgEl = messageEl.closest('.ds-message') || messageEl;
        const tmpDiv = document.createElement('div');
        tmpDiv.innerHTML = fullMsgEl.innerHTML;
        tmpDiv.querySelectorAll(
          '.ds-think-content, [class*="think"], [class*="thinking"], [class*="reasoning"], ' +
          '[class*="_767406f"], [class*="e1675d8b"], [class*="_5255ff8"], [data-type="think"], ' +
          '.think-container, .reasoning-container, .ds-reasoning'
        ).forEach(el => el.remove());
        contentHTML = tmpDiv.innerHTML;
        contentText = tmpDiv.textContent.trim();
      }

      const fullMsgElForMeta = messageEl.closest('.ds-message') || messageEl;
      const virtualContainer = fullMsgElForMeta.closest('[data-virtual-list-item-key]');
      const messageKey = virtualContainer ? virtualContainer.getAttribute('data-virtual-list-item-key') : '';
      const sessionMatch = window.location.pathname.match(/\/a\/chat\/s\/([a-zA-Z0-9_-]+)/);
      const sessionId = sessionMatch ? sessionMatch[1] : '';
      const conversationTitle = await DS.getTrustedTitle();

      const messageId = Date.now().toString() + '_' + Math.random().toString(36).slice(2, 8);
      const baseUrl = window.location.href.split('#')[0];
      let sharedLink = baseUrl + '#ds-msg=' + encodeURIComponent(messageId);
      if (messageKey) sharedLink += '&msg-key=' + encodeURIComponent(messageKey);
      if (sessionId) sharedLink += '&session=' + encodeURIComponent(sessionId);

      const data = {
        id: messageId,
        messageKey: messageKey,
        sessionId: sessionId,
        messageRole: messageRole,
        contentHTML: contentHTML,
        contentText: contentText.slice(0, 500),
        conversationTitle: conversationTitle,
        url: baseUrl,
        sharedLink: sharedLink,
        timestamp: Date.now(),
        createdAt: new Date().toISOString()
      };

      if (data.contentHTML.length > 100000) {
        data.contentHTML = data.contentHTML.slice(0, 100000);
      }

      const stored = await chrome.storage.local.get(['messageBookmarks']);
      const bookmarks = stored['messageBookmarks'] || [];
      const contentTextTruncated = data.contentText.slice(0, 500);
      const exists = bookmarks.some(b => b.messageRole === messageRole && b.contentText === contentTextTruncated);
      if (exists) {
        DS.showToast(lang === 'en' ? '⚠️ Message already bookmarked' : '⚠️ 此消息已在收藏夹中');
        btn.classList.add('bookmarked');

        return;
      }

      bookmarks.unshift(data);
      await chrome.storage.local.set({ messageBookmarks: bookmarks });
      btn.classList.add('bookmarked');
      var bookmarkTitles = { zh: '已收藏', en: 'Bookmarked' };
      btn.title = bookmarkTitles[lang] || bookmarkTitles.zh;
      DS.showToast(lang === 'en' ? '⭐ Message bookmarked' : '⭐ 已收藏此消息');
      chrome.runtime.sendMessage({ action: 'bookmark-updated' }).catch(() => {});
    } catch (e) {
      console.error('[DeepSeek-Assistant] Message bookmark failed:', e);
      DS.showToast(lang === 'en' ? '❌ Bookmark failed' : '❌ 消息收藏失败');
    } finally {
      btn.disabled = false;
    }
  };

})();