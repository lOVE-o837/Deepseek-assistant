// content-search.js — 当前页面内容搜索
// 拆分自原 content.js 的 searchCurrentPage、scrollToResult 及相关函数
/**
 * DeepSeek Assistant - content-search.js
 * 当前对话页面内容搜索
 * 依赖：content-utils.js (window.__DS__)
 */
(function() {
  const DS = window.__DS__ = window.__DS__ || {};

  DS.searchCurrentPage = function searchCurrentPage(query) {
    if (!document.getElementById('ds-search-highlight-style')) {
      const style = document.createElement('style');
      style.id = 'ds-search-highlight-style';
      style.textContent = 'mark, .highlight { background-color: #ff4d4f !important; color: #ffffff !important; }';
      document.head.appendChild(style);
    }

    if (!query) return [];
    const lowerQuery = query.toLowerCase();

    const container = DS.getMainConversationContainer();
    if (!container) return [];

    const selectors = [
      '.ds-message',
      '.ds-markdown',
      '.ds-markdown-paragraph',
      '.ds-assistant-message-main-content',
    ];

    const seenElements = new Set();
    const allCandidates = [];
    for (const sel of selectors) {
      try {
        const found = container.querySelectorAll(sel);
        for (const el of found) {
          if (!seenElements.has(el)) {
            seenElements.add(el);
            allCandidates.push(el);
          }
        }
      } catch (e) {}
    }

    if (allCandidates.length === 0) {
      const containerText = container.textContent || '';
      if (containerText.toLowerCase().includes(lowerQuery)) {
        return [{
          title: '页面内容匹配',
          type: '全文',
          snippet: DS.getContextSnippet(containerText, lowerQuery),
          url: DS.findConversationLink(container) || window.location.origin + window.location.pathname
        }];
      }
      return [];
    }

    const ancestorIdx = new Set();
    for (let i = 0; i < allCandidates.length; i++) {
      for (let j = i + 1; j < allCandidates.length; j++) {
        try {
          if (allCandidates[i].contains(allCandidates[j])) ancestorIdx.add(i);
          else if (allCandidates[j].contains(allCandidates[i])) ancestorIdx.add(j);
        } catch (e) {}
      }
    }
    const filtered = allCandidates.filter((_, idx) => !ancestorIdx.has(idx));

    const seenTexts = new Set();
    const results = [];
    filtered.forEach((el, filteredIdx) => {
      const text = (el.textContent || '').trim();
      if (!text || text.length < 2) return;

      if (DS.isThinkingElement(el)) return;

      if (text.toLowerCase().includes(lowerQuery)) {
        const dedupKey = text.slice(0, 100).toLowerCase().replace(/\s+/g, ' ') + '|' + text.length;
        if (seenTexts.has(dedupKey)) return;
        seenTexts.add(dedupKey);

        let type = '内容';
        const cls = (typeof el.className === 'string' ? el.className : '').toLowerCase();
        const pcls = (el.parentElement && typeof el.parentElement.className === 'string' ? el.parentElement.className : '').toLowerCase();
        const combined = cls + ' ' + pcls;
        if (/d29f3d7d|user|human/i.test(combined)) type = 'User';
        else if (/ds-markdown|ds-assistant|_74c0879|dbe8cf4a/i.test(combined)) type = 'AI';

        let title = '';
        const heading = el.querySelector('h1, h2, h3, h4, h5, h6, strong, [class*="title"]');
        if (heading) title = heading.textContent.trim().slice(0, 80);
        if (!title) {
          title = text.replace(/\s+/g, ' ').slice(0, 60).trim();
          if (text.length > 60) title += '...';
        }

        results.push({
          title,
          type,
          snippet: DS.getContextSnippet(text, lowerQuery),
          url: '',
          index: filteredIdx,
          timestamp: results.length
        });
      }
    });

    return results;
  };

  DS.scrollToResult = function scrollToResult(index) {
    const container = DS.getMainConversationContainer();
    if (!container) return;

    const selectors = [
      '.ds-message',
      '.ds-markdown',
      '.ds-markdown-paragraph',
      '.ds-assistant-message-main-content',
    ];

    const seen = new Set();
    const msgs = [];
    for (const sel of selectors) {
      try {
        container.querySelectorAll(sel).forEach(el => {
          if (!seen.has(el)) { seen.add(el); msgs.push(el); }
        });
      } catch (e) {}
    }

    const ancestorIdx = new Set();
    for (let i = 0; i < msgs.length; i++) {
      for (let j = i + 1; j < msgs.length; j++) {
        try {
          if (msgs[i].contains(msgs[j])) ancestorIdx.add(i);
          else if (msgs[j].contains(msgs[i])) ancestorIdx.add(j);
        } catch (e) {}
      }
    }
    const filtered = msgs.filter((_, i) => !ancestorIdx.has(i));

    if (filtered.length > index) {
      const el = filtered[index];
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });

      const origOutline = el.style.outline;
      const origOutlineOffset = el.style.outlineOffset;
      const origBoxShadow = el.style.boxShadow;
      const origTransition = el.style.transition;

      el.style.transition = 'outline 0.15s ease, box-shadow 0.15s ease';

      let toggle = 0;
      const blinkTimer = setInterval(() => {
        if (toggle % 2 === 0) {
          el.style.outline = '3px solid #ff4d4f';
          el.style.outlineOffset = '3px';
          el.style.boxShadow = '0 0 14px rgba(255, 77, 79, 0.55)';
        } else {
          el.style.outline = origOutline || '';
          el.style.outlineOffset = origOutlineOffset || '';
          el.style.boxShadow = origBoxShadow || '';
        }
        toggle++;
        if (toggle >= 6) {
          clearInterval(blinkTimer);
          el.style.outline = origOutline || '';
          el.style.outlineOffset = origOutlineOffset || '';
          el.style.boxShadow = origBoxShadow || '';
          el.style.transition = origTransition || '';
        }
      }, 350);
    }
  };

})();