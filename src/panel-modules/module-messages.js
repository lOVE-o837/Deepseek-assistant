// module-messages.js
  // ==================== 消息收藏面板 ====================

  // ==================== 模块: 消息收藏 ====================
async function renderMessageBookmarks(filterQuery, sort = 'newest') {
    const container = dom.messageBookmarkList;
    if (!container) return;

    const query = (filterQuery || '').toLowerCase();
    let messageBookmarks = await storageGet('messageBookmarks') || [];

    if (state.selectedFolderId) {
      messageBookmarks = messageBookmarks.filter(m => (m.folderId || null) === state.selectedFolderId);
    }
    if (query) {
      const folders = await storageGet('folders') || [];
      const matchedFolderIds = new Set(folders.filter(f => f.name.toLowerCase().includes(query)).map(f => f.id));
      messageBookmarks = messageBookmarks.filter(m =>
        (m.messageRole && m.messageRole.toLowerCase().includes(query)) ||
        (m.conversationTitle && m.conversationTitle.toLowerCase().includes(query)) ||
        (m.contentText && m.contentText.toLowerCase().includes(query)) ||
        (m.note && m.note.toLowerCase().includes(query)) ||
        (m.folderId && matchedFolderIds.has(m.folderId))
      );
    }

    if (sort === 'oldest') {
      messageBookmarks.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    } else if (sort === 'title') {
      messageBookmarks.sort((a, b) => (a.conversationTitle || '').localeCompare(b.conversationTitle || '', 'zh-CN'));
    } else {
      // 默认 newest：时间倒序
      messageBookmarks.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    }

    if (messageBookmarks.length === 0) {
      var en = (typeof state !== 'undefined' && state.preferredLanguage === 'en');
      container.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">💬</span>
          <p>${en ? 'No message bookmarks' : '暂无消息收藏'}</p>
          <p class="empty-hint">${en ? 'Hover over a message and click the star to bookmark it' : '在对话页面中，鼠标悬停消息，点击星标按钮收藏单条消息'}</p>
        </div>`;
      return;
    }

    // 更新消息收藏统计
    const msgCountEl = document.getElementById('message-bookmark-count');
    if (msgCountEl) {
      if (messageBookmarks.length > 0) {
        msgCountEl.style.display = 'block';
        msgCountEl.textContent = t('messagesCountPrefix') + messageBookmarks.length + t('messagesCountSuffix');
      } else {
        msgCountEl.style.display = 'none';
      }
    }

    // 为同对话多条消息添加序号（分组处理）
const grouped = new Map();
messageBookmarks.forEach(m => {
  const key = m.url || m.conversationUrl || '';
  if (!grouped.has(key)) grouped.set(key, []);
  grouped.get(key).push(m);
});
grouped.forEach((items, key) => {
  if (items.length > 1) {
    items.forEach((item, index) => {
      item._groupIndex = index + 1;
      item._groupSize = items.length;
    });
  }
});
container.innerHTML = messageBookmarks.map(m => {
      const roleTag = m.messageRole === 'AI' ? '<span class="role-tag role-ai">' + t('messagesAI') + '</span>' : '<span class="role-tag role-user">' + t('messagesUser') + '</span>';
      const preview = (m.contentText || '').slice(0, 150);
      let title = m.conversationTitle || t('messagesUntitled');
  if (m._groupIndex !== undefined) {
    title += ` (${m._groupIndex}/${m._groupSize})`;
  }
      const time = formatTime(m.timestamp, state.showAbsoluteTime);
      const url = m.url || m.conversationUrl || '';
      const sharedLink = m.sharedLink || (url ? (url + (url.includes('#') ? '&' : '#') + 'ds-msg=' + encodeURIComponent(m.id)) : '');
      // 关键词高亮（仅在有搜索关键词时）
      const highlightedTitle = query ? highlightText(title, query) : escapeHTML(title);
      const highlightedPreview = query && preview ? highlightText(preview, query) : escapeHTML(preview);

      return `
        <div class="msg-bookmark-card" data-id="${escapeHTML(m.id)}" data-url="${escapeHTML(url)}" data-shared-link="${escapeHTML(sharedLink)}" data-role="${escapeHTML(m.messageRole || '')}">
          <div class="msg-card-header">
            ${roleTag}
            <span class="msg-card-time">${escapeHTML(time)}</span>
          </div>
          <div class="msg-card-title">${highlightedTitle}</div>
          <div class="msg-card-preview">${highlightedPreview}</div>
          ${m.note ? `<div class="msg-card-note">📝 ${t('noteLabel')}：${highlightText(m.note, query)}</div>` : ''}
          <div class="list-item-actions">
            <button class="btn btn-outline btn-sm msg-open-btn">${t('open')}</button>
            <button class="btn btn-outline btn-sm msg-edit-note-btn" style="margin-left:4px;">${t('note')}</button>
            <button class="btn btn-danger-outline btn-sm msg-delete-btn">${t('delete')}</button>
            <button class="btn btn-move-folder btn-sm msg-move-btn" style="margin-left:4px;">${t('moveTo')}</button>
          </div>
        </div>`;
    }).join('');

    bindMessageCardEvents();
    refreshBookmarkStats(); // 异步刷新统计条
  }

  function bindMessageCardEvents() {
    const cards = dom.messageBookmarkList.querySelectorAll('.msg-bookmark-card');
    cards.forEach((card) => {
      // 打开消息对话（供卡片和按钮共用）
      function openMessageConversation() {
        const sharedLink = card.getAttribute('data-shared-link');
        const url = card.getAttribute('data-url');
        const id = card.getAttribute('data-id');
        if (sharedLink) {
          window.open(sharedLink, '_blank');
          showToast(t('messagesOpening'));
        } else if (url) {
          const separator = url.includes('#') ? '&' : '#';
          const jumpUrl = url + separator + 'ds-msg=' + encodeURIComponent(id);
          window.open(jumpUrl, '_blank');
          showToast(t('messagesOpening'));
        }
      }

      // 卡片整体点击
      card.addEventListener('click', openMessageConversation);

      // 打开按钮
      const openBtn = card.querySelector('.msg-open-btn');
      if (openBtn) {
        openBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          
          // 显示加载提示
          showToast(t('messagesLocating'));
          
          // 设置超时，如果 8 秒后仍未跳转成功（页面无变化），给出建议
          const timeoutId = setTimeout(() => {
            showToast(t('messagesTimeout'));
          }, 8000);
          
          // 调用打开函数，并在成功跳转后清除超时（需要在 openMessageConversation 中实现回调）
          // 但由于 openMessageConversation 是异步跳转，我们简化处理：不自动清除超时，因为页面跳转后原页面销毁，超时不会执行。
          openMessageConversation();
          
          // 注意：如果页面跳转到新 URL，setTimeout 会被浏览器清理，无需担心。
        });
      }

      // 删除按钮
      const deleteBtn = card.querySelector('.msg-delete-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const id = card.getAttribute('data-id');
          if (!id) return;
          const bookmarks = await storageGet('messageBookmarks') || [];
          const updated = bookmarks.filter(b => b.id !== id);
          await storageSet('messageBookmarks', updated);
          renderMessageBookmarks();
          await refreshBookmarkStats();
          showToast(t('messageDeleted'));
        });
      }
      const editNoteBtn = card.querySelector('.msg-edit-note-btn');
      if (editNoteBtn) {
        editNoteBtn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const id = card.getAttribute('data-id');
          const bookmarks = await storageGet('messageBookmarks') || [];
          const bookmark = bookmarks.find(b => b.id === id);
          if (!bookmark) return;
          const newNote = prompt(t('messagesEditPrompt'), bookmark.note || '');
          if (newNote !== null) {
            bookmark.note = newNote.trim() || undefined;
            await storageSet('messageBookmarks', bookmarks);
            renderMessageBookmarks(); // 刷新列表并保留筛选排序
            await refreshBookmarkStats();
            showToast(t('messagesNoteSaved'));
          }
        });
      }
      const moveBtn = card.querySelector('.msg-move-btn');
      if (moveBtn) {
        moveBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          showMoveToFolderDialog('messageBookmarks', card.getAttribute('data-id'));
        });
      }
    });
  }



  // ==================== 收藏项 URL 打开策略 ====================

  /**
   * 打开收藏项 URL：
   *   - 分享链接（chat.deepseek.com/share/ 或 chat.deepseek.com/a/chat/s/）→ window.open 新标签页
   *   - 其他 URL → background open-url 中转
   */




