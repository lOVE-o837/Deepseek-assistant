// content-utils.js — 纯工具函数
// 拆分自原 content.js 的 getTrustedTitle、waitForMessageElement、
// findMessageElement、showToast、escapeHTML 等不依赖业务状态的函数
/**
 * DeepSeek Assistant - content-utils.js
 * 纯工具函数集合，挂载到 window.__DS__ 供 content.js 及其他模块使用
 * 无外部依赖，无副作用
 */
(function () {
  const DS = window.__DS__ = window.__DS__ || {};

  DS.escapeHTML = function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  DS.showToast = function showToast(message) {
    let container = document.getElementById('ds-assistant-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'ds-assistant-toast-container';
      container.style.cssText = [
        'position: fixed;',
        'top: 20px;',
        'left: 50%;',
        'transform: translateX(-50%);',
        'z-index: 99999;',
        'display: flex;',
        'flex-direction: column;',
        'align-items: center;',
        'gap: 8px;',
        'pointer-events: none;'
      ].join('');
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = [
      'background: rgba(0,0,0,0.8);',
      'color: #fff;',
      'padding: 10px 20px;',
      'border-radius: 8px;',
      'font-size: 14px;',
      'pointer-events: auto;',
      'animation: ds-toast-in 0.3s ease;'
    ].join('');
    container.appendChild(toast);

    if (!document.getElementById('ds-toast-style')) {
      const style = document.createElement('style');
      style.id = 'ds-toast-style';
      style.textContent = [
        '@keyframes ds-toast-in {',
        '  from { opacity: 0; transform: translateY(-10px); }',
        '  to { opacity: 1; transform: translateY(0); }',
        '}'
      ].join('\n');
      document.head.appendChild(style);
    }

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  };

  DS.getTrustedTitle = async function getTrustedTitle() {
    const rawTitle = (document.title || '').trim();
    console.log('[DeepSeek-Assistant][getTrustedTitle] 原始 document.title =', JSON.stringify(rawTitle));

    let currentTitle = rawTitle;
    currentTitle = currentTitle.replace(/\s*[-–—|]\s*DeepSeek.*$/i, '').trim();
    console.log('[DeepSeek-Assistant][getTrustedTitle] 清洗后 title =', JSON.stringify(currentTitle));

    if (!currentTitle) {
      const pathParts = window.location.pathname.split('/').filter(Boolean);
      currentTitle = pathParts[pathParts.length - 1] || '未命名对话';
      console.log('[DeepSeek-Assistant][getTrustedTitle] 降级到 pathname =', JSON.stringify(currentTitle));
    }

    const finalTitle = currentTitle.slice(0, 100);
    console.log('[DeepSeek-Assistant][getTrustedTitle] 最终返回 title =', JSON.stringify(finalTitle));
    return finalTitle;
  };

  DS.getPageTitle = function getPageTitle() {
    if (document.title && document.title.trim()) {
      return document.title.trim().slice(0, 100);
    }
    return '未命名对话';
  };

  DS.getPageSnippet = function getPageSnippet() {
    const selectors = [
      '[class*="message"]',
      '[class*="chat"] p',
      'article p'
    ];
    for (const sel of selectors) {
      try {
        const el = document.querySelector(sel);
        if (el && el.textContent.trim()) {
          return el.textContent.trim().slice(0, 150);
        }
      } catch (e) {
        // continue
      }
    }
    return '';
  };

  DS.parseTimeText = function parseTimeText(text) {
    if (!text) return 0;

    var now = Date.now();

    var directParse = Date.parse(text);
    if (!isNaN(directParse) && directParse > 0) return directParse;

    var cnMatch = text.match(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
    if (cnMatch) return new Date(parseInt(cnMatch[1]), parseInt(cnMatch[2]) - 1, parseInt(cnMatch[3])).getTime();

    var ymMatch = text.match(/(\d{4})\s*年\s*(\d{1,2})\s*月/);
    if (ymMatch) return new Date(parseInt(ymMatch[1]), parseInt(ymMatch[2]) - 1, 1).getTime();

    var enYmMatch = text.match(/(\d{4})\s*[-/]\s*(\d{1,2})(?!\s*[-/]\s*\d{1,2})/);
    if (enYmMatch) return new Date(parseInt(enYmMatch[1]), parseInt(enYmMatch[2]) - 1, 1).getTime();

    var dateMatch = text.match(/(\d{4})[-\/]\s*(\d{1,2})[-\/]\s*(\d{1,2})/);
    if (dateMatch) return new Date(parseInt(dateMatch[1]), parseInt(dateMatch[2]) - 1, parseInt(dateMatch[3])).getTime();

    var hourMatch = text.match(/(\d+)\s*(小时前|小时之前)/);
    if (hourMatch) return now - parseInt(hourMatch[1]) * 3600000;
    var minMatch = text.match(/(\d+)\s*(分钟前|分钟之前)/);
    if (minMatch) return now - parseInt(minMatch[1]) * 60000;
    var dayMatch = text.match(/(\d+)\s*(天前|天之前)/);
    if (dayMatch) return now - parseInt(dayMatch[1]) * 86400000;

    if (/刚刚|几秒/.test(text)) return now;

    var d = new Date(now);
    if (/昨天|yesterday/i.test(text)) { d.setDate(d.getDate() - 1); d.setHours(0, 0, 0, 0); return d.getTime(); }
    if (/前天/.test(text)) { d.setDate(d.getDate() - 2); d.setHours(0, 0, 0, 0); return d.getTime(); }
    if (/今天|today/i.test(text)) { d.setHours(0, 0, 0, 0); return d.getTime(); }

    var weekMatch = text.match(/(\d+)\s*天内/);
    if (weekMatch) {
      var days = parseInt(weekMatch[1]) || 7;
      return now - Math.floor(days / 2) * 86400000;
    }

    if (/本周|这周|this week/i.test(text)) { d.setDate(d.getDate() - 3); return d.getTime(); }
    if (/本月|这个月|this month/i.test(text)) { d.setDate(1); return d.getTime(); }

    return 0;
  };

  DS.getMainConversationContainer = function getMainConversationContainer() {
    const mainArea = document.querySelector('._7780f2e');
    if (mainArea && mainArea.querySelectorAll('.ds-message').length >= 1) return mainArea;

    const vl = document.querySelector('[class*="ds-virtual-list"][class*="printable"]');
    if (vl && vl.querySelectorAll('.ds-message').length >= 1) return vl;

    const alt = document.querySelector('[class*="_765a5cd"]');
    if (alt && alt.querySelectorAll('.ds-message').length >= 1) return alt;

    const c3 = document.querySelector('.c3ecdb44');
    if (c3) {
      for (const child of c3.children) {
        const cls = (typeof child.className === 'string' ? child.className : '');
        if (/dc04ec1d|a02af2e6|sidebar/i.test(cls)) continue;
        const msgs = child.querySelectorAll('.ds-message');
        if (msgs.length >= 1) return child;
      }
    }

    const sidebar = document.querySelector('[class*="dc04ec1d"], [class*="a02af2e6"], [class*="sidebar"]');
    if (sidebar) {
      const parent = sidebar.parentElement;
      if (parent) {
        for (const child of parent.children) {
          if (child !== sidebar && child.querySelectorAll('.ds-message').length >= 1) {
            return child;
          }
        }
      }
    }

    return document.body;
  };

  DS.isThinkingElement = function isThinkingElement(el) {
    let current = el;
    while (current && current !== document.body && current !== document.documentElement) {
      const cls = (typeof current.className === 'string' ? current.className : '').toLowerCase();
      const baseCls = (typeof current.className === 'object' && current.className.baseVal
        ? current.className.baseVal : '').toLowerCase();
      const combinedCls = cls + ' ' + baseCls;
      if (/ds-think-content|e1675d8b|_767406f|_5255ff8|thinking|reasoning|thought|think|深度思考|推理过程/i.test(combinedCls)) {
        return true;
      }

      if (current.getAttribute) {
        for (const attr of ['aria-label', 'data-type', 'data-reasoning', 'data-thinking',
          'data-testid', 'data-role', 'data-section', 'title']) {
          const val = (current.getAttribute(attr) || '').toLowerCase();
          if (/thinking|reasoning|thought|think|思考|推理|深度思/i.test(val)) return true;
        }
        for (const attrName of current.getAttributeNames()) {
          if (/thinking|reasoning|thought|think|深度思考/i.test(attrName.toLowerCase())) return true;
        }
      }

      current = current.parentElement;
    }

    const ownText = (el.textContent || '').trim().slice(0, 30).toLowerCase();
    if (/^(已深度思考|已思考|深度思考|思考过程|推理过程|reasoning|thinking)/i.test(ownText)) return true;

    return false;
  };

  DS.findConversationLink = function findConversationLink(el) {
    const link = el.closest('a[href]');
    if (link) {
      const href = link.getAttribute('href');
      if (href && href !== '#' && !href.startsWith('javascript:')) {
        return href.startsWith('http') ? href : window.location.origin + href;
      }
    }

    let current = el;
    while (current && current !== document.body && current !== document.documentElement) {
      for (const attr of ['data-conversation-id', 'data-chat-id', 'data-thread-id', 'data-conv-id']) {
        const val = current.getAttribute && current.getAttribute(attr);
        if (val && val.length >= 4) {
          const pathParts = window.location.pathname.split('/').filter(Boolean);
          if (pathParts.length > 0) {
            pathParts[pathParts.length - 1] = val;
          } else {
            pathParts.push('a', 'chat', 's', val);
          }
          return window.location.origin + '/' + pathParts.join('/');
        }
      }
      current = current.parentElement;
    }

    const pn = window.location.pathname;
    const convMatch = pn.match(/\/(?:a\/chat\/s|c)\/([a-zA-Z0-9_-]+)/);
    if (convMatch && convMatch[1] && convMatch[1].length >= 4) {
      return window.location.origin + pn;
    }

    return window.location.origin + window.location.pathname;
  };

  DS.getContextSnippet = function getContextSnippet(text, lowerQuery) {
    const index = text.toLowerCase().indexOf(lowerQuery);
    if (index === -1) return text.slice(0, 200);

    const start = Math.max(0, index - 60);
    const end = Math.min(text.length, index + lowerQuery.length + 80);
    let snippet = text.slice(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';
    return snippet;
  };

  DS.detectMessageRole = function detectMessageRole(messageEl) {
    if (messageEl.querySelector('.ds-markdown, [class*="ds-markdown"]')) {
      return 'AI';
    }
    return '\u7528\u6237';
  };

  DS.findScrollableContainer = function findScrollableContainer() {
    var deepseekSelectors = [
      '._765a5cd',
      '[class*="ds-scroll-area"]',
      '._7780f2e',
      '[class*="chat-scroll"]',
      '[class*="conversation-content"]',
      '[class*="chat-content"]',
      '[class*="message-list"]',
      '[class*="chat-messages"]',
      'main',
      '[role="main"]'
    ];
    for (var i = 0; i < deepseekSelectors.length; i++) {
      var el = document.querySelector(deepseekSelectors[i]);
      if (el && el.scrollHeight > el.clientHeight) return el;
    }
    var messages = document.querySelectorAll('.ds-message');
    if (messages.length > 0) {
      var parent = messages[0].parentElement;
      while (parent && parent !== document.body) {
        var cs = window.getComputedStyle(parent);
        if ((cs.overflowY === 'auto' || cs.overflowY === 'scroll') && parent.scrollHeight > parent.clientHeight) {
          return parent;
        }
        parent = parent.parentElement;
      }
    }
    return window;
  };

})();

