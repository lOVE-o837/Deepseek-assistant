// content-sidebar.js — 左侧侧边栏对话列表抓取
// 拆分自原 content.js 的 fetchSidebarConversations 及相关函数
/**
 * DeepSeek Assistant - content-sidebar.js
 * 抓取侧边栏对话列表
 * 依赖：content-utils.js (window.__DS__)
 */
(function() {
  const DS = window.__DS__ = window.__DS__ || {};

  DS.fetchSidebarConversations = async function fetchSidebarConversations() {
    const conversations = [];

    const MAX_RETRIES = 10;
    const RETRY_DELAY = 500;
    let items = [];
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      items = Array.from(document.querySelectorAll('a[href*="/chat/"]'));
      if (items.length >= 3) break;
      await new Promise(r => setTimeout(r, RETRY_DELAY));
    }

    if (items.length === 0) {
      conversations.push({
        title: lang === 'en' ? 'No conversations' : '暂无对话记录',
        url: window.location.href,
        snippet: '',
        timestamp: Date.now()
      });
      return conversations;
    }

    const groupLabels = Array.from(document.querySelectorAll('.f3d18f6a'));
    const groupTimes = [];
    groupLabels.forEach(label => {
      const text = (label.textContent || '').trim();
      const now = Date.now();
      const DAY = 86400000;
      let t = 0;
      if (/今天|today/i.test(text)) t = now;
      else if (/昨天|yesterday/i.test(text)) t = now - DAY;
      else if (/前天/.test(text)) t = now - 2 * DAY;
      else if (/7\s*天/.test(text)) t = now - 3.5 * DAY;
      else if (/30\s*天/.test(text)) t = now - 15 * DAY;
      else if (/^(\d{4})-(\d{2})$/.test(text)) {
        const m = text.match(/^(\d{4})-(\d{2})$/);
        t = new Date(parseInt(m[1]), parseInt(m[2]) - 1, 15).getTime();
      }
      if (t > 0) groupTimes.push(t);
    });
    let currentGroupIdx = 0;

    const seen = new Set();
    items.forEach((el, idx) => {
      const text = (el.textContent || '').trim();
      const href = el.getAttribute('href') || el.querySelector('a')?.getAttribute('href') || '';

      if (!text || text.length < 2) return;

      const key = text.slice(0, 80);
      if (seen.has(key)) return;
      seen.add(key);

      let timestamp = 0;

      const timeSelectors = [
        '[class*="time"]',
        '[class*="date"]',
        '[class*="timestamp"]',
        '[class*="Time"]',
        '[class*="Date"]',
        '[class*="Timestamp"]',
        'time',
        '[datetime]',
        '[title]',
        '[class*="meta"]'
      ];

      for (const timeSel of timeSelectors) {
        try {
          const timeEl = el.querySelector(timeSel);
          if (timeEl) {
            const timeText = timeEl.textContent?.trim() || '';
            const dateAttr = timeEl.getAttribute('datetime');

            if (dateAttr) {
              const parsed = Date.parse(dateAttr);
              if (!isNaN(parsed) && parsed > 0) {
                timestamp = parsed;
                break;
              }
            }

            if (timeText) {
              const parsedTime = DS.parseTimeText(timeText);
              if (parsedTime > 0) {
                timestamp = parsedTime;
                break;
              }
            }
          }
        } catch (e) {}
      }

      if (timestamp === 0) {
        const titleAttr = el.getAttribute('title');
        if (titleAttr) {
          const parsed = DS.parseTimeText(titleAttr);
          if (parsed > 0) {
            timestamp = parsed;
          }
        }
      }

      if (timestamp === 0) {
        const parsed = DS.parseTimeText(text);
        if (parsed > 0) {
          timestamp = parsed;
        }
      }

      let groupTime = 0;
      if (currentGroupIdx < groupTimes.length && groupTimes[currentGroupIdx] > 0) {
        groupTime = groupTimes[currentGroupIdx];
        const groupSize = Math.ceil(items.length / groupTimes.length);
        if ((idx + 1) % groupSize === 0) currentGroupIdx++;
      }
      const fallbackTimestamp = timestamp || groupTime || (Date.now() - idx * 3600000);

      conversations.push({
        title: text.slice(0, 100),
        url: href.startsWith('http') ? href : (href ? new URL(href, window.location.origin).href : window.location.href),
        snippet: '',
        timestamp: fallbackTimestamp
      });
    });

    return conversations;
  };

})();