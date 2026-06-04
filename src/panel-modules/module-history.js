// module-history.js
// ==================== 模块: 历史搜索 ====================
let _cachedConversations = [];

  async function loadHistoryData(forceRefresh = false) {
    if (!dom.historyList) return;
    updateHistoryToolbarText();

    const query = dom.historySearchInput ? dom.historySearchInput.value.trim().toLowerCase() : '';
    const now = Date.now();

    // 检查缓存
    if (!forceRefresh && historyCache.conversations && 
        (now - historyCache.timestamp) < CACHE_TTL && 
        historyCache.query === query) {
      // 使用缓存数据直接渲染
      applyHistoryData(historyCache.conversations, query);
      return;
    }

    // 显示加载中状态
    dom.historyCount.textContent = t('historyLoading');
   dom.historyList.innerHTML = '<div class="empty-state"><span class="empty-icon">&#x1F4AD;</span><p>' + t('historyLoadingHint') + '</p><p class="empty-hint">' + t('historyFetchingHint') + '</p></div>';

    // 原有获取逻辑
    let conversations = [];
    let fetchError = null;
    const MAX_RETRIES = 5;
    const RETRY_DELAY_MS = 500;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await safeSendMessage({ action: 'fetch-sidebar-conversations' });
        if (response && response.success) {
          conversations = response.conversations || [];
          _cachedConversations = conversations;
          if (conversations.length > 0) break;
        }
      } catch (e) {
        fetchError = e;
      }
      if (attempt < MAX_RETRIES) {
        dom.historyCount.textContent = t('historyLoadingHint') + ` (${attempt}/${MAX_RETRIES - 1})`;
        await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
      }
    }

    if (conversations.length === 0 && _cachedConversations.length > 0) {
      conversations = _cachedConversations;
    }

    if (conversations.length === 0) {
      const history = await storageGet('searchHistory');
      const items = history || [];
      conversations = items.map(item => ({
        title: item.query || item.title || t('historyUnknown'),
        url: item.url || '',
        id: 'hist_' + Math.random().toString(36).slice(2),
        type: item.type || t('historySearchType'),
        timestamp: item.timestamp || null
      }));
    }

    // 更新缓存
    historyCache = {
      conversations: conversations,
      timestamp: Date.now(),
      query: query
    };

    // 渲染
    applyHistoryData(conversations, query);
  }

  // 渲染历史搜索列表（从 loadHistoryData 提取）
  function applyHistoryData(conversations, query) {
    // 按时间排序
    let sorted = [...conversations];
    if (state.historySortOrder === 'desc') {
      sorted.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    } else {
      sorted.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    }

    let filtered = sorted;
    if (query) {
      filtered = sorted.filter(c =>
        (c.title && c.title.toLowerCase().includes(query))
      );
    }

updateHistorySortLabel();
updateHistoryToolbarText();

dom.historyCount.textContent = (state.preferredLanguage === 'en' ? 'Total: ' + filtered.length : '共 ' + filtered.length + ' 条记录');
  if (filtered.length > 0 && filtered.length <= 3 && !query && _cachedConversations.length <= 3) {
    dom.historyCount.textContent += t('historySidebarHint');
  }

    if (filtered.length === 0) {
      dom.historyList.innerHTML = sorted.length === 0
        ? getHistoryEmptyHTML()
        : '<div class="empty-state"><span class="empty-icon">🔍</span><p>' + t('historyNotFound') + '</p></div>';
      return;
    }

    dom.historyList.innerHTML = filtered.map((item, index) =>
      renderHistoryItem(item, index, query)
    ).join('');

    bindHistoryItemEvents();
  }


  function getFilteredHistoryData() {
    const query = dom.historySearchInput ? dom.historySearchInput.value.trim().toLowerCase() : '';
    let data = [..._cachedConversations];
    if (query) {
      data = data.filter(c => c.title && c.title.toLowerCase().includes(query));
    }
    if (state.historySortOrder === 'desc') {
      data.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    } else {
      data.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    }
    return data;
  }

  function exportHistoryToCSV() {
    const data = getFilteredHistoryData();
    if (data.length === 0) { showToast(t('historyNoExport')); return; }
    const header = t('historyCsvTitle') + ',' + t('historyCsvUrl') + ',' + t('historyCsvTime');
    const rows = data.map(item => {
      const title = (item.title || t('historyUntitled')).replace(/"/g, '""');
      const url = (item.url || '').replace(/"/g, '""');
      const time = item.timestamp ? new Date(item.timestamp).toLocaleString(state.preferredLanguage === 'en' ? 'en-US' : 'zh-CN') : '';
      return `"${title}","${url}","${time}"`;
    });
    const csv = '\uFEFF' + header + '\n' + rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `deepseek-history-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    showToast(t('historyExported') + data.length + ' ' + t('historyCountSuffix').trim());
  }

  function renderHistoryItem(item, index, query) {
    const title = item.title || item.query || t('historyUntitled');
    const url = item.url || '';
    const timestamp = item.timestamp ? new Date(item.timestamp).toLocaleString(state.preferredLanguage === 'en' ? 'en-US' : 'zh-CN') : '';
    const type = item.type || t('historyTypeConv');
    // 将标题中的匹配关键词用 <mark> 高亮
    const highlightedTitle = query ? highlightText(title, query) : escapeHTML(title);

    return `
      <div class="list-item" data-index="${index}" data-url="${escapeHTML(url)}">
        <div class="list-item-title">${highlightedTitle}</div>
        <div class="list-item-meta">
          <span class="list-item-tag">${escapeHTML(type)}</span>
          ${timestamp ? `<span>${escapeHTML(timestamp)}</span>` : ''}
          ${url ? `<span class="list-item-link" style="font-size:10px;color:var(--panel-text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:200px;">${escapeHTML(url)}</span>` : ''}
        </div>
      </div>
    `;
  }

  function bindHistoryItemEvents() {
    const listItems = dom.historyList.querySelectorAll('.list-item');
    listItems.forEach(el => {
      el.addEventListener('click', () => {
        const url = el.getAttribute('data-url');
        if (url) {
          safeSendMessage({ action: 'open-url', url });
        }
      });
      // 右键收藏 — 从列表项中提取标题和 URL
      el.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const titleEl = el.querySelector('.list-item-title');
        const title = titleEl ? titleEl.textContent || '' : '';
        const url = el.getAttribute('data-url') || '';
        bookmarkViaContent(title, url, '');
      });
    });
  }

  async function clearAllHistory() {
    await storageSet('searchHistory', []);
    await loadHistoryData(true);
    showToast(t('historyCleared'));
  }

  function getHistoryEmptyHTML() {
    return `
      <div class="empty-state">
        <span class="empty-icon">💭</span>
        <p>${t('historyEmptyTitle')}</p>
        <p class="empty-hint">${t('historyEmptyHint')}</p>
      </div>
    `;
  }

// 刷新历史搜索工具栏全部按钮文本（刷新/导出/排序），语言切换或页面初始化时调用
  function updateHistoryToolbarText() {
    if (dom.btnHistoryRefresh) {
      dom.btnHistoryRefresh.textContent = t('historyBtnRefresh');
      dom.btnHistoryRefresh.title = t('historyRefreshTitle');
    }
    if (dom.btnHistoryExport) {
      dom.btnHistoryExport.textContent = t('historyBtnExport');
      dom.btnHistoryExport.title = t('historyExportTitle');
    }
    if (dom.btnHistorySort) {
      dom.btnHistorySort.textContent = state.historySortOrder === 'desc' ? t('historySortAsc') : t('historySortDesc');
      dom.btnHistorySort.title = t('historySortTitle');
    }
  }

// 根据当前排序状态更新排序按钮文本（时间正序 ↔ 时间倒序），点击排序或列表渲染后调用
   function updateHistorySortLabel() {
    if (dom.btnHistorySort) {
      dom.btnHistorySort.textContent = state.historySortOrder === 'desc' ? t('historySortAsc') : t('historySortDesc');
    }
  } 

// 切换历史搜索的排序方向（时间正序 ↔ 时间倒序），更新按钮文本并重新加载列表
    function toggleHistorySort() {
    state.historySortOrder = state.historySortOrder === 'desc' ? 'asc' : 'desc';
    updateHistorySortLabel();
    loadHistoryData();
  }