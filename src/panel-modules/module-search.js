// module-search.js
  // ==================== 当前对话搜索 ====================

  async function executeCurrentSearch() {
    const query = dom.currentSearchInput ? dom.currentSearchInput.value.trim() : '';
    if (!query) {
      showToast(t('searchEnterKeyword'));
      return;
    }

    dom.currentSearchCount.textContent = t('searchSearching');

    safeSendMessage({
      action: 'search-current-page',
      query
    }, (response) => {
      if (response && response.success) {
        // 按当前排序设置排序
        let results = response.results || [];
        if (state.currentSortOrder === 'desc') {
          results.sort((a, b) => (b.timestamp || b.index || 0) - (a.timestamp || a.index || 0));
        } else {
          results.sort((a, b) => (a.timestamp || a.index || 0) - (b.timestamp || b.index || 0));
        }
        renderSearchResults(results, query);
      } else {
        dom.currentSearchCount.textContent = t('searchFailed');
        dom.currentSearchResults.innerHTML = getSearchEmptyHTML();
      }
    });
  }

  function renderSearchResults(results, query) {
    if (!dom.currentSearchResults) return;

    // 缓存搜索结果
    state.currentSearchResults = results || [];
    state.currentSearchQuery = query || '';

    // 显示排序按钮
    if (dom.btnCurrentSort) {
      dom.btnCurrentSort.style.display = 'inline-flex';
      dom.btnCurrentSort.style.minWidth = '72px';
    }

    if (!results || results.length === 0) {
      dom.currentSearchCount.textContent = t('searchNotFoundPrefix') + query + t('searchNotFoundSuffix');
      dom.currentSearchResults.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">🔎</span>
          <p>${t('searchNoMatch')}</p>
          <p class="empty-hint">${t('searchTryOther')}</p>
        </div>
      `;
      if (dom.btnCurrentSort) dom.btnCurrentSort.style.display = 'none';
      return;
    }

    dom.currentSearchCount.textContent = t('searchFoundPrefix') + results.length + t('searchFoundSuffix');

    // 添加复制按钮（如果尚未存在）
    let copyBtn = document.getElementById('copy-current-results-btn');
    if (!copyBtn) {
      copyBtn = document.createElement('button');
      copyBtn.id = 'copy-current-results-btn';
      copyBtn.className = 'btn btn-outline btn-sm';
      copyBtn.innerHTML = t('searchCopyBtn');
      copyBtn.style.marginLeft = '8px';
      // 插入到 search-stats 内或旁边，这里插入到 currentSearchCount 后面
      const statsContainer = dom.currentSearchCount.parentNode;
      if (statsContainer && !document.getElementById('copy-current-results-btn')) {
        statsContainer.appendChild(copyBtn);
      }
    }
    // 绑定复制事件（避免重复绑定）
    if (copyBtn && !copyBtn.hasAttribute('data-listener')) {
      copyBtn.setAttribute('data-listener', 'true');
      copyBtn.addEventListener('click', () => copySearchResults(results));
    }

    dom.currentSearchResults.innerHTML = results.map((result, index) => {
      const snippet = result.snippet ? highlightText(result.snippet, query) : '';
      const title = result.title || t('searchMatchItem') + (index + 1);
      var rawType = result.type || '';
      var type;
      if (rawType === 'AI') {
          type = t('messagesAI');
      } else if (rawType === 'User') {
          type = t('messagesUser');
      } else {
          type = rawType || t('searchTypeContent');
      }

      const url = result.url || '';
      // 使用 result.index（filteredIdx）而非 map 循环 index，确保 scrollToResult 定位正确
      const targetIdx = result.index !== undefined ? result.index : index;

      // 标题也做关键词高亮
      const highlightedTitle = highlightText(title, query);

      return `
        <div class="list-item" data-index="${targetIdx}" data-url="${escapeHTML(url)}">
          <div class="list-item-title">${highlightedTitle}</div>
          <div class="list-item-snippet" style="font-size:12px;color:var(--panel-text-secondary);line-height:1.6;margin-bottom:6px;">${snippet}</div>
          <div class="list-item-meta">
            <span class="list-item-tag">${escapeHTML(type)}</span>
          </div>
        </div>
      `;
    }).join('');

    // 绑定点击滚动
    bindSearchResultEvents(results);
  }

  function bindSearchResultEvents(results) {
    const items = dom.currentSearchResults.querySelectorAll('.list-item');
    items.forEach(el => {
      el.addEventListener('click', () => {
        const url = el.getAttribute('data-url');
        if (url) {
          safeSendMessage({ action: 'open-url', url });
        } else {
          const index = parseInt(el.getAttribute('data-index'));
          safeSendMessage({ action: 'scroll-to-result', index });
        }
      });
      // 右键收藏 — 从列表项中提取标题和 URL
      el.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const snippet = el.querySelector('.list-item-snippet')?.textContent || '';
        const titleEl = el.querySelector('.list-item-title');
        const title = titleEl ? titleEl.textContent || '' : '';
        const url = el.getAttribute('data-url') || '';
        bookmarkViaContent(title, url, snippet);
      });
    });
  }

  // 复制当前搜索结果到剪贴板（带 fallback）
  async function copySearchResults(results) {
    if (!results || results.length === 0) {
      showToast(t('searchNoCopy'));
      return;
    }
    const lines = [];
    lines.push(t('searchClipPrefix') + results.length + t('searchClipSuffix'));
    lines.push('');
    results.forEach((result, idx) => {
      const title = result.title || t('searchMatchItem') + (idx + 1);
      const snippet = result.snippet || '';
      const url = result.url || (result.conversationUrl ? result.conversationUrl + (result.index !== undefined ? `#ds-msg-${result.index}` : '') : '');
      lines.push(`${idx + 1}. ${title}`);
      if (snippet) lines.push(`   ${snippet}`);
      if (url) lines.push(`   🔗 ${url}`);
      lines.push('');
    });
    const text = lines.join('\n');

    // 尝试现代 API
    try {
      await navigator.clipboard.writeText(text);
      showToast(t('searchCopiedPrefix') + results.length + t('searchCopiedSuffix'));
      return;
    } catch (e) {
      console.warn('Clipboard API 失败，使用 fallback', e);
    }

    // Fallback: 使用 textarea 和 execCommand
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      const success = document.execCommand('copy');
      if (success) {
        showToast(t('searchCopiedPrefix') + results.length + t('searchCopiedSuffix'));
      } else {
        throw new Error('execCommand 返回 false');
      }
    } catch (err) {
      showToast(t('searchCopyFailed'));
    } finally {
      document.body.removeChild(textarea);
    }
  }

// 切换当前对话搜索的排序方向，重新排列已有结果并刷新显示
  function toggleCurrentSort() {
    state.currentSortOrder = state.currentSortOrder === 'desc' ? 'asc' : 'desc';
    if (dom.btnCurrentSort) {
      dom.btnCurrentSort.textContent = state.currentSortOrder === 'desc' ? t('searchSortAsc') : t('searchSortDesc');
    }
    // 重新排序并渲染已有结果
    if (state.currentSearchResults.length > 0) {
      const sorted = [...state.currentSearchResults];
      if (state.currentSortOrder === 'desc') {
        sorted.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      } else {
        sorted.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      }
      renderSearchResults(sorted, state.currentSearchQuery);
    }
  }


  function getSearchEmptyHTML() {
    return `
      <div class="empty-state">
        <span class="empty-icon">🔎</span>
        <p>${t('currentSearchEmptyTitle')}</p>
        <p class="empty-hint">${t('currentSearchEmptyHint')}</p>
        <p class="empty-hint" style="font-size:11px; opacity:0.8; margin-top:8px;">${t('searchEmptyHint2')}</p>
        <p class="empty-hint" style="font-size:11px; opacity:0.6;">${t('searchEmptyHint3')}</p>
      </div>
    `;
  }