// module-bookmarks.js
// ==================== 模块: 对话收藏 ====================
async function loadBookmarkData() {
    if (!dom.bookmarkList) return;

    // 确保统计条容器存在
    ensureBookmarkStatsBar();

    const bookmarks = await storageGet('bookmarks') || [];
    const messageBookmarks = await storageGet('messageBookmarks') || [];

    // 计算原始数量（用于统计条）
    let convCount = bookmarks.length;
    let msgCount = messageBookmarks.length;
    if (state.selectedFolderId) {
      convCount = bookmarks.filter(b => (b.folderId || null) === state.selectedFolderId).length;
      msgCount = messageBookmarks.filter(m => (m.folderId || null) === state.selectedFolderId).length;
    }
    // 更新统计条（无文件夹时显示“全部”）
    updateBookmarkStats(convCount, msgCount, state.selectedFolderId);

    const query = dom.bookmarkSearchInput ? dom.bookmarkSearchInput.value.trim().toLowerCase() : '';
    const sort = dom.bookmarkSort ? dom.bookmarkSort.value : 'newest';

    let filtered = bookmarks;
    if (state.selectedFolderId) {
      filtered = filtered.filter(b => (b.folderId || null) === state.selectedFolderId);
    }
    if (query) {
      const folders = await storageGet('folders') || [];
      const matchedFolderIds = new Set(folders.filter(f => f.name.toLowerCase().includes(query)).map(f => f.id));
      filtered = bookmarks.filter(b =>
        (b.title && b.title.toLowerCase().includes(query)) ||
        (b.url && b.url.toLowerCase().includes(query)) ||
        (b.snippet && b.snippet.toLowerCase().includes(query)) ||
        (b.note && b.note.toLowerCase().includes(query)) ||
        (b.folderId && matchedFolderIds.has(b.folderId))
      );
    }

    // 排序
    if (sort === 'newest') {
      filtered.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    } else if (sort === 'oldest') {
      filtered.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    } else if (sort === 'title') {
      filtered.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'zh-CN'));
    }

    dom.bookmarkCount.textContent = t('bookmarksCountPrefix') + filtered.length + t('bookmarksCountSuffix');

    if (filtered.length === 0) {
      dom.bookmarkList.innerHTML = bookmarks.length === 0
        ? getBookmarkEmptyHTML()
        : `<div class="empty-state"><span class="empty-icon">🔍</span><p>${t('bookmarksNoMatch')}</p></div>`;
    } else {
      dom.bookmarkList.innerHTML = filtered.map(b => renderBookmarkItem(b, query)).join('');
      bindBookmarkItemEvents(filtered);
    }

    // 同时渲染消息收藏（支持搜索过滤）
    renderMessageBookmarks(query, sort);
  }
  const debouncedLoadBookmarkData = debounce(loadBookmarkData, 300);

  // 实时更新搜索匹配数量（不重新渲染列表）
  async function updateBookmarkSearchStats() {
    const query = dom.bookmarkSearchInput ? dom.bookmarkSearchInput.value.trim().toLowerCase() : '';
    const bookmarks = await storageGet('bookmarks') || [];
    const messageBookmarks = await storageGet('messageBookmarks') || [];

    let convFiltered = bookmarks;
    let msgFiltered = messageBookmarks;
    if (state.selectedFolderId) {
      convFiltered = convFiltered.filter(b => (b.folderId || null) === state.selectedFolderId);
      msgFiltered = msgFiltered.filter(m => (m.folderId || null) === state.selectedFolderId);
    }
    if (query) {
      const folders = await storageGet('folders') || [];
      const matchedFolderIds = new Set(folders.filter(f => f.name.toLowerCase().includes(query)).map(f => f.id));
      convFiltered = convFiltered.filter(b =>
        (b.title && b.title.toLowerCase().includes(query)) ||
        (b.url && b.url.toLowerCase().includes(query)) ||
        (b.snippet && b.snippet.toLowerCase().includes(query)) ||
        (b.note && b.note.toLowerCase().includes(query)) ||
        (b.folderId && matchedFolderIds.has(b.folderId))
      );
      msgFiltered = msgFiltered.filter(m =>
        (m.conversationTitle && m.conversationTitle.toLowerCase().includes(query)) ||
        (m.contentText && m.contentText.toLowerCase().includes(query)) ||
        (m.note && m.note.toLowerCase().includes(query)) ||
        (m.folderId && matchedFolderIds.has(m.folderId))
      );
    }
    const totalMatch = convFiltered.length + msgFiltered.length;
    const totalAll = (state.selectedFolderId ? 
      (bookmarks.filter(b => (b.folderId || null) === state.selectedFolderId).length +
       messageBookmarks.filter(m => (m.folderId || null) === state.selectedFolderId).length) :
      (bookmarks.length + messageBookmarks.length));
    
    if (dom.bookmarkCount) {
      if (query) {
        dom.bookmarkCount.textContent = t('bookmarksCountMatchPrefix') + totalAll + t('bookmarksCountMatchMid') + totalMatch + t('bookmarksCountMatchSuffix');
      } else {
        dom.bookmarkCount.textContent = t('bookmarksCountPrefix') + totalAll + t('bookmarksCountSuffix');
      }
    }
  }


  function renderBookmarkItem(bookmark, query) {
    const title = bookmark.title || t('bookmarksUntitled');
    const snippet = bookmark.snippet ? bookmark.snippet.slice(0, 100) : '';
    const timestamp = bookmark.timestamp ? formatTime(bookmark.timestamp, state.showAbsoluteTime) : '';
    const id = bookmark.id || '';
    // 关键词高亮
    const highlightedTitle = query ? highlightText(title, query) : escapeHTML(title);
    const highlightedSnippet = query && snippet ? highlightText(snippet, query) : escapeHTML(snippet || '');
    const highlightedNote = query && bookmark.note ? highlightText(bookmark.note, query) : (bookmark.note ? escapeHTML(bookmark.note) : '');

    return `
      <div class="list-item" data-id="${escapeHTML(id)}" data-url="${escapeHTML(bookmark.url || '')}">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;">
          <div class="list-item-title" style="flex:1;margin-bottom:0;">${highlightedTitle}</div>
          ${timestamp ? `<span class="msg-card-time" style="flex-shrink:0;margin-left:8px;white-space:nowrap;">${escapeHTML(timestamp)}</span>` : ''}
        </div>
        ${snippet ? `<div style="font-size:12px;color:var(--panel-text-secondary);margin-bottom:4px;">${highlightedSnippet}</div>` : ''}
        ${bookmark.note ? `<div style="font-size:12px;color:var(--panel-accent);margin-bottom:4px;font-weight:500;">📝 ${highlightedNote}</div>` : ''}
        <div class="list-item-actions">
          <button class="btn btn-outline btn-sm bookmark-open-btn">${t('open')}</button>
          <button class="btn btn-outline btn-sm bookmark-edit-note-btn" style="margin-left:4px;">${t('note')}</button>
          <button class="btn btn-danger-outline btn-sm bookmark-delete-btn">${t('delete')}</button>
          <button class="btn btn-move-folder btn-sm bookmark-move-btn" style="margin-left:4px;">${t('moveTo')}</button>
        </div>
      </div>
    `;
  }

  function bindBookmarkItemEvents(bookmarks) {
    const items = dom.bookmarkList.querySelectorAll('.list-item');
    items.forEach(el => {
      // 打开链接 — 分享链接用 window.open 在新标签页打开
      const openBtn = el.querySelector('.bookmark-open-btn');
      if (openBtn) {
        openBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const url = el.getAttribute('data-url');
          if (url) {
            __openBookmarkUrl__(url);
          }
        });
      }

      // 标题点击也打开 — 分享链接用 window.open 在新标签页打开
      el.addEventListener('click', (e) => {
        if (e.target.classList.contains('bookmark-delete-btn') ||
            e.target.classList.contains('bookmark-open-btn')) {
          return;
        }
        const url = el.getAttribute('data-url');
        if (url) {
          __openBookmarkUrl__(url);
        }
      });

      // 删除按钮
      const deleteBtn = el.querySelector('.bookmark-delete-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const id = el.getAttribute('data-id');
          await deleteBookmark(id);
        });
      }
      const editNoteBtn = el.querySelector('.bookmark-edit-note-btn');
      if (editNoteBtn) {
        editNoteBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const id = el.getAttribute('data-id');
          const bookmarks = await storageGet('bookmarks') || [];
          const bookmark = bookmarks.find(b => b.id === id);
          if (!bookmark) return;
          const newNote = prompt(t('bookmarksEditPrompt'), bookmark.note || '');
          if (newNote !== null) {
            bookmark.note = newNote.trim() || undefined;
            await storageSet('bookmarks', bookmarks);
            loadBookmarkData(); // 刷新列表和统计
            showToast(t('bookmarksNoteSaved'));
          }
        });
      }
      const moveBtn = el.querySelector('.bookmark-move-btn');
      if (moveBtn) {
        moveBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          showMoveToFolderDialog('bookmarks', el.getAttribute('data-id'));
        });
      }
    });
  }

  async function deleteBookmark(id) {
    if (!id) return;
    const bookmarks = await storageGet('bookmarks') || [];
    const updated = bookmarks.filter(b => b.id !== id);
    await storageSet('bookmarks', updated);
    loadBookmarkData();
    showToast(t('bookmarkDeleted'));
  }


   // ==================== 右键收藏辅助 ====================

   // 通过 background.js 中转收藏操作，将面板内获取的对话标题/URL/摘要发送给 content.js 执行收藏
  function bookmarkViaContent(title, url, snippet) {
    safeSendMessage({
      action: 'bookmark-from-panel',
      data: { title: title || '', url: url || '', snippet: snippet || '', timestamp: Date.now() }
    }, (response) => {
      if (response && response.success) {
        console.log('[DeepSeek-Assistant][panel:bookmarkViaContent] 收藏成功');
        loadBookmarkData();
      } else if (response && response.error) {
        console.warn('[DeepSeek-Assistant][panel:bookmarkViaContent] 收藏失败:', response.error);
        loadBookmarkData();
      } else {
        console.warn('[DeepSeek-Assistant][panel:bookmarkViaContent] 收藏失败，未知错误');
        loadBookmarkData();
      }
    });
  } 
  
  // 打开收藏项的 URL：分享链接直接用 window.open 新标签页打开，其余通过 background open-url 中转
  function __openBookmarkUrl__(url) {
    if (!url) return;
    // 判断是否为 DeepSeek 分享链接
    const isDeepSeekUrl = url.includes('chat.deepseek.com');
    if (isDeepSeekUrl) {
      window.open(url, '_blank');
    } else {
      safeSendMessage({ action: 'open-url', url });
    }
  }

  async function exportBookmarks() {
    const [convBookmarks, msgBookmarks] = await Promise.all([
      storageGet('bookmarks').then(r => r || []),
      storageGet('messageBookmarks').then(r => r || [])
    ]);
    if (convBookmarks.length === 0 && msgBookmarks.length === 0) {
      showToast(t('bookmarksEmptyExport'));
      return;
    }
    showExportFormatDialog(convBookmarks);
  }

  function showExportFormatDialog(bookmarks) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.cssText = [
      'position:fixed;inset:0;background:rgba(0,0,0,0.5);',
      'display:flex;align-items:center;justify-content:center;z-index:10000;'
    ].join('');

    const dialog = document.createElement('div');
    dialog.className = 'modal-dialog';
    dialog.innerHTML = [
      '<h3>' + t('exportDialogTitle') + '</h3>',
      '<p>' + t('exportDialogHint') + '</p>',
      '<div class="modal-actions" style="flex-direction:column;gap:8px;">',
        '<button id="export-json-btn" class="btn btn-primary" style="width:100%;">' + t('exportJSON') + '</button>',
        '<button id="export-txt-btn" class="btn btn-outline" style="width:100%;">' + t('exportTXT') + '</button>',
        '<button id="export-md-btn" class="btn btn-outline" style="width:100%;">' + t('exportMD') + '</button>',
        '<button id="export-cancel-btn" class="btn btn-outline" style="width:100%;">' + t('cancel') + '</button>',
      '</div>'
    ].join('');

    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    const cleanup = () => overlay.remove();

    dialog.querySelector('#export-json-btn').addEventListener('click', () => {
      cleanup();
      exportAsJSON(bookmarks);
    });

    dialog.querySelector('#export-txt-btn').addEventListener('click', () => {
      cleanup();
      exportAsTXT(bookmarks);
    });

    dialog.querySelector('#export-txt-btn').addEventListener('click', () => {
      cleanup();
      exportAsTXT(bookmarks);
    });

    dialog.querySelector('#export-md-btn').addEventListener('click', () => {
      cleanup();
      exportAsMarkdown(bookmarks);
    });

    dialog.querySelector('#export-cancel-btn').addEventListener('click', cleanup);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) cleanup();
    });
  }

  async function exportAsJSON(bookmarks) {
    const [convBookmarks, msgBookmarks] = await Promise.all([
      storageGet('bookmarks').then(r => r || []),
      storageGet('messageBookmarks').then(r => r || [])
    ]);
    const merged = [
      ...convBookmarks.map(b => ({ ...b, type: '对话收藏' })),
      ...msgBookmarks.map(m => ({ ...m, type: '消息收藏' }))
    ];
    const data = JSON.stringify(merged, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deepseek-bookmarks-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t('bookmarksExportDone') + convBookmarks.length + t('bookmarksExportMid') + msgBookmarks.length + t('bookmarksExportEnd'));
  }

  async function exportAsTXT(bookmarks) {
    const [convBookmarks, msgBookmarks] = await Promise.all([
      storageGet('bookmarks').then(r => r || []),
      storageGet('messageBookmarks').then(r => r || [])
    ]);
    const merged = [
      ...convBookmarks.map(b => ({ ...b, type: '对话收藏' })),
      ...msgBookmarks.map(m => ({ ...m, type: '消息收藏' }))
    ];
    const lines = [];
    lines.push('DeepSeek助手 - 收藏夹导出');
    lines.push('导出时间：' + new Date().toLocaleString('zh-CN'));
    lines.push('共 ' + merged.length + ' 项收藏（对话收藏 ' + convBookmarks.length + ' 项，消息收藏 ' + msgBookmarks.length + ' 项）');
    lines.push('');
    merged.forEach((b, i) => {
      lines.push('========== 收藏项 ' + (i + 1) + ' ==========');
      lines.push('类型：' + (b.type || ''));
      lines.push('标题：' + (b.title || '无标题'));
      lines.push('网址：' + (b.url || b.conversationUrl || ''));
      if (b.messageRole) lines.push('消息角色：' + b.messageRole);
      if (b.contentText) lines.push('消息内容：' + b.contentText);
      else if (b.snippet) lines.push('摘要：' + b.snippet);
      if (b.timestamp) lines.push('收藏时间：' + new Date(b.timestamp).toLocaleString('zh-CN'));
      if (b.note) lines.push('备注：' + b.note);
      lines.push('');
    });
    const text = lines.join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deepseek-bookmarks-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(t('bookmarksExportDone') + convBookmarks.length + t('bookmarksExportMid') + msgBookmarks.length + t('bookmarksExportEnd'));
  }

  async function exportAsMarkdown(bookmarks) {
    var convBookmarks = bookmarks || [];
    var msgBookmarks = await storageGet('messageBookmarks').then(function(r) { return r || []; });
    var merged = [];
    convBookmarks.forEach(function(b) { merged.push(Object.assign({}, b, { type: '对话收藏' })); });
    msgBookmarks.forEach(function(m) { merged.push(Object.assign({}, m, { type: '消息收藏' })); });

    var lines = [];
    lines.push('# DeepSeek助手 - 收藏夹导出');
    lines.push('');
    lines.push('> 导出时间：' + new Date().toLocaleString('zh-CN'));
    lines.push('> 共 ' + merged.length + ' 项收藏');
    lines.push('');

    merged.forEach(function(b, i) {
      lines.push('---');
      lines.push('');
      lines.push('## ' + (i + 1) + '. ' + (b.title || '无标题'));
      lines.push('');
      if (b.messageRole) {
        lines.push('**角色**：' + (b.messageRole === 'AI' ? '🤖 AI回答' : '👤 用户提问'));
        lines.push('');
        if (b.contentHTML) {
          try {
            var doc = new DOMParser().parseFromString(b.contentHTML, 'text/html');
            // ★ 移除残留思考节点
            var thinkSelectors = ['[class*="think"]', '[class*="thinking"]', '[class*="reasoning"]', '[class*="_767406f"]', '[class*="e1675d8b"]', '.ds-think-content'];
            thinkSelectors.forEach(function(sel) {
              doc.querySelectorAll(sel).forEach(function(el) { el.remove(); });
            });
            var markdown = convertHtmlToMarkdown(doc.body);
            if (markdown.trim().length > 10) {
              lines.push(markdown);
            } else {
              lines.push(b.contentText || '');
            }
          } catch (e) {
            lines.push(b.contentText || '');
          }
        } else {
          lines.push(b.contentText || '');
        }
      } else {
        if (b.url) lines.push('- **网址**：' + b.url);
        if (b.snippet) lines.push('- **摘要**：' + b.snippet);
        if (b.note) lines.push('- **备注**：' + b.note);
      }
      if (b.timestamp) lines.push('- **收藏时间**：' + new Date(b.timestamp).toLocaleString('zh-CN'));
      lines.push('');
    });

    var text = lines.join('\n');
    var blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'deepseek-bookmarks-' + new Date().toISOString().slice(0, 19).replace(/:/g, '-') + '.md';
    a.click();
    URL.revokeObjectURL(url);
    showToast(t('bookmarksExportMDDone'));
  }

function convertHtmlToMarkdown(el) {
    if (!el) return '';
    var result = '';
    var tags = el.querySelectorAll('h1, h2, h3, h4, h5, h6, p, strong, b, em, i, li, blockquote, pre, code, hr, br');
    var processed = new Set();
    for (var i = 0; i < tags.length; i++) {
      var node = tags[i];
      if (processed.has(node)) continue;
      var tag = node.tagName.toUpperCase();
      var text = node.textContent.trim();
      var parent = node.parentElement;
      if (parent && (parent.tagName === 'PRE' || parent.tagName === 'CODE')) continue;
      processed.add(node);

      if (tag === 'PRE') {
        var codeEl = node.querySelector('code');
        var codeText = codeEl ? codeEl.textContent : node.textContent;
        var lang = '';
        if (codeEl) {
          var cls = codeEl.className || '';
          var match = cls.match(/language-(\w+)/);
          if (match) lang = match[1];
        }
        result += '```' + lang + '\n' + codeText.trim() + '\n```\n\n';
      } else if (tag === 'H1') result += '# ' + text + '\n\n';
      else if (tag === 'H2') result += '## ' + text + '\n\n';
      else if (tag === 'H3') result += '### ' + text + '\n\n';
      else if (tag === 'H4') result += '#### ' + text + '\n\n';
      else if (tag === 'H5') result += '##### ' + text + '\n\n';
      else if (tag === 'H6') result += '###### ' + text + '\n\n';
      else if (tag === 'P') result += text + '\n\n';
      else if (tag === 'LI') result += '- ' + text + '\n';
      else if (tag === 'BLOCKQUOTE') result += '> ' + text.replace(/\n/g, '\n> ') + '\n\n';
      else if (tag === 'HR') result += '---\n\n';
      else if (tag === 'BR') result += '\n';
    }
    if (!result.trim()) {
      result = (el.textContent || '').trim();
    }
    return result.trim();
  }

  async function importBookmarks() {
    const file = dom.importFileInput ? dom.importFileInput.files[0] : null;
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!Array.isArray(data)) { showToast(t('bookmarksImportFormatErr')); return; }

      const convItems = data.filter(item => item.type === '对话收藏');
      const msgItems = data.filter(item => item.type === '消息收藏');
      const legacyItems = data.filter(item => !item.type);
      const allConvItems = [...convItems, ...legacyItems];

      let addedConv = 0, addedMsg = 0;

      if (allConvItems.length > 0) {
        const existingConvs = await storageGet('bookmarks') || [];
        const existingKeys = new Set(existingConvs.map(b => b.url || b.title));
        for (const item of allConvItems) {
          const key = item.url || item.title || '';
          if (key && !existingKeys.has(key)) {
            existingConvs.push({
              ...item,
              id: item.id || Date.now().toString() + '_' + Math.random().toString(36).slice(2),
              createdAt: item.createdAt || new Date().toISOString()
            });
            existingKeys.add(key);
            addedConv++;
          }
        }
        await storageSet('bookmarks', existingConvs);
      }

      if (msgItems.length > 0) {
        const existingMsgs = await storageGet('messageBookmarks') || [];
        const existingMsgKeys = new Set(existingMsgs.map(m => m.messageRole + '|' + (m.contentText || '').slice(0, 200)));
        for (const item of msgItems) {
          const key = (item.messageRole || '') + '|' + (item.contentText || '').slice(0, 200);
          if (!existingMsgKeys.has(key)) {
            existingMsgs.push({
              ...item,
              id: item.id || Date.now().toString() + '_' + Math.random().toString(36).slice(2),
              createdAt: item.createdAt || new Date().toISOString()
            });
            existingMsgKeys.add(key);
            addedMsg++;
          }
        }
        await storageSet('messageBookmarks', existingMsgs);
      }

      const totalAdded = addedConv + addedMsg;
      if (totalAdded > 0) {
        showToast(t('bookmarksImported') + addedConv + t('bookmarksImportedMid') + addedMsg + t('bookmarksImportedEnd'));
      } else {
        showToast(t('bookmarksImportNoNew'));
      }
    } catch (e) { showToast(t('bookmarksImportFailed')); }
    if (dom.importFileInput) dom.importFileInput.value = '';
  }

  async function clearAllBookmarks() {
    const [convBookmarks, msgBookmarks] = await Promise.all([
      storageGet('bookmarks').then(r => r || []),
      storageGet('messageBookmarks').then(r => r || [])
    ]);
    if (convBookmarks.length === 0 && msgBookmarks.length === 0) {
      showToast(t('bookmarksEmptyClear'));
      return;
    }
    if (!confirm(t('clearAllConfirmPrefix') + convCount + t('clearAllConfirmConv') + msgCount + t('clearAllConfirmSuffix'))) return;
    await storageSet('bookmarks', []);
    await storageSet('messageBookmarks', []);
    loadBookmarkData();
    showToast(t('bookmarksCleared'));
  }

function getBookmarkEmptyHTML() {
    var en = (typeof state !== 'undefined' && state.preferredLanguage === 'en');
    return `
      <div class="empty-state">
        <span class="empty-icon">⭐</span>
        <p>${en ? 'No bookmarks yet' : '收藏夹为空'}</p>
        <p class="empty-hint">${en ? 'Manage important conversations with sorting, search, and export' : '一站式管理重要对话，支持排序、搜索与 JSON/TXT/Markdown 导出备份'}</p>
        <p class="empty-hint" style="margin-top:8px;">${en ? '⭐ Click floating button or Ctrl+Shift+X to bookmark' : '⭐ 点击页面右下角悬浮按钮，或使用快捷键 Ctrl+Shift+X 收藏当前对话'}</p>
        <p class="empty-hint" style="margin-top:4px;">${en ? '🔍 Right-click in search results to quick bookmark' : '🔍 在历史搜索和当前对话搜索结果中，右键对话也可快速收藏'}</p>
      </div>
    `;
  }

   // ==================== 快捷导出 ====================



  function exportBookmarksDirect() {
    const data = {
      bookmarks: state.bookmarks || [],
      messageBookmarks: state.messageBookmarks || [],
      folders: state.folders || [],
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const now = new Date();
    const ts = now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0') + '-' +
      String(now.getHours()).padStart(2, '0') + '-' +
      String(now.getMinutes()).padStart(2, '0') + '-' +
      String(now.getSeconds()).padStart(2, '0');
    a.download = 'deepseek-bookmarks-' + ts + '.json';
    a.click();
    URL.revokeObjectURL(url);
  } 


  function updateBookmarkUI() {
    document.querySelectorAll('.bookmark-open-btn').forEach(b => b.textContent = t('bookmarksOpen'));
    document.querySelectorAll('.bookmark-edit-note-btn').forEach(b => b.textContent = t('bookmarksNoteBtn'));
    document.querySelectorAll('.bookmark-delete-btn').forEach(b => b.textContent = t('bookmarksDelete'));
    document.querySelectorAll('.bookmark-move-btn').forEach(b => b.textContent = t('bookmarksMoveTo'));
}

// 强制刷新对话收藏空状态文本
function updateBookmarkEmptyState() {
  var container = document.getElementById('bookmark-list');
  if (!container) return;
  var empty = container.querySelector('.empty-state');
  if (!empty) return;
  empty.querySelectorAll('[data-i18n]').forEach(function(el) {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
}

// 强制刷新消息收藏空状态文本
function updateMessageEmptyState() {
  var container = document.getElementById('message-bookmark-list');
  if (!container) return;
  var empty = container.querySelector('.empty-state');
  if (!empty) return;
  empty.querySelectorAll('[data-i18n]').forEach(function(el) {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
}