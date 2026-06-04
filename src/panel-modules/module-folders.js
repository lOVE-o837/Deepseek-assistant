// module-folders.js
// ==================== 模块: 文件夹管理 ====================
async function loadFolders() {
    const folders = await storageGet('folders') || [];
    if (folders.length === 0) {
      const preset = [
        { id: 'folder_1', name: '工作相关', createdAt: new Date().toISOString() },
        { id: 'folder_2', name: '学习笔记', createdAt: new Date().toISOString() }
      ];
      await storageSet('folders', preset);
    }
  }

  function injectFolderBar() {
    const tab = document.getElementById('tab-bookmarks');
    if (!tab) return;
    let bar = document.getElementById('ds-folder-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'ds-folder-bar';
      bar.style.cssText = 'display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap;align-items:center;flex-shrink:0;';
      const toolbar = tab.querySelector('.bookmark-toolbar');
      if (toolbar) toolbar.parentNode.insertBefore(bar, toolbar);
      else tab.insertBefore(bar, tab.firstChild);
    }
    // 确保 row 容器包裹文件夹栏和统计条（每次切换标签页都执行）
    let row = document.getElementById('folder-stats-row');
    let statsBar = document.getElementById('bookmark-stats');
    if (!row) {
      row = document.createElement('div');
      row.id = 'folder-stats-row';
      row.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:8px;';
      bar.parentNode.insertBefore(row, bar);
      row.appendChild(bar);
      if (!statsBar) {
        statsBar = document.createElement('div');
        statsBar.id = 'bookmark-stats';
        statsBar.className = 'stats-bar';
      }
      row.appendChild(statsBar);
    }
    storageGet('folders').then(folders => {
      folders = folders || [];
      bar.innerHTML = '';
      const allBtn = document.createElement('button');
      allBtn.textContent = t('foldersAll');
      allBtn.style.cssText = 'padding:4px 12px;border-radius:14px;border:1.5px solid ' + (state.selectedFolderId === '' ? 'var(--panel-accent)' : 'var(--panel-border)') + ';background:' + (state.selectedFolderId === '' ? 'var(--panel-accent)' : 'var(--panel-bg)') + ';color:' + (state.selectedFolderId === '' ? '#fff' : 'var(--panel-text-secondary)') + ';font-size:12px;cursor:pointer;white-space:nowrap;transition:all 0.15s ease;font-family:inherit;';
      allBtn.addEventListener('click', () => selectFolder(''));
      bar.appendChild(allBtn);
      folders.forEach(f => {
        const tag = document.createElement('button');
        tag.textContent = f.name;
        const active = state.selectedFolderId === f.id;
        tag.style.cssText = 'padding:4px 12px;border-radius:14px;border:1.5px solid ' + (active ? 'var(--panel-accent)' : 'var(--panel-border)') + ';background:' + (active ? 'var(--panel-accent)' : 'var(--panel-bg)') + ';color:' + (active ? '#fff' : 'var(--panel-text-secondary)') + ';font-size:12px;cursor:pointer;white-space:nowrap;transition:all 0.15s ease;font-family:inherit;display:inline-flex;align-items:center;gap:4px;';
        tag.addEventListener('click', () => selectFolder(f.id));
      const actionWrap = document.createElement('span');
      actionWrap.style.cssText = 'display:inline-flex;gap:2px;margin-left:6px;';
      const rename = document.createElement('span');
      rename.textContent = '✎';
      rename.title = t('foldersRenameTitle');
      rename.style.cssText = 'font-size:13px;padding:0 4px;border-radius:4px;cursor:pointer;color:var(--panel-text-secondary);transition:background 0.15s;line-height:1;';
      rename.addEventListener('mouseenter', () => rename.style.background = 'var(--primary-color-light, rgba(79,70,229,0.12))');
      rename.addEventListener('mouseleave', () => rename.style.background = 'none');
      rename.addEventListener('click', (e) => { e.stopPropagation(); renameFolder(f.id); });
      const del = document.createElement('span');
      del.textContent = '×';
      del.title = t('foldersDeleteTitle');
      del.style.cssText = 'font-size:15px;padding:0 5px;border-radius:4px;cursor:pointer;color:var(--panel-text-secondary);transition:background 0.15s;line-height:1;';
      del.addEventListener('mouseenter', () => del.style.background = 'rgba(234,67,53,0.12)');
      del.addEventListener('mouseleave', () => del.style.background = 'none');
      del.addEventListener('click', (e) => { e.stopPropagation(); deleteFolder(f.id); });
      actionWrap.appendChild(rename);
      actionWrap.appendChild(del);
      tag.appendChild(actionWrap);
        bar.appendChild(tag);
      });
      const addBtn = document.createElement('button');
      addBtn.textContent = t('foldersNew');
      addBtn.title = t('foldersNewFolderTitle');
      addBtn.style.cssText = 'width:28px;height:28px;padding:0;border-radius:50%;border:1.5px dashed var(--panel-border);background:var(--panel-bg);color:var(--panel-text-secondary);font-size:16px;font-weight:bold;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;';
      addBtn.addEventListener('click', createFolder);
      // 下拉包装
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'display:inline-flex;align-items:center;position:relative;';
      const trigger = document.createElement('button');
      // 文本将在获取文件夹列表后动态设置
      trigger.style.cssText = 'padding:4px 12px;border-radius:14px;border:1.5px solid var(--panel-border);background:var(--panel-bg);color:var(--panel-text-primary);font-size:12px;cursor:pointer;white-space:nowrap;font-family:inherit;';
      const drop = document.createElement('div');
      drop.style.cssText = 'display:none;position:absolute;top:100%;left:0;z-index:110;background:var(--panel-bg);border:1px solid var(--panel-border);border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.1);min-width:140px;max-height:200px;overflow-y:auto;padding:4px 0;';
      const searchBox = document.createElement('input');
      searchBox.type = 'text';
      searchBox.placeholder = t('foldersSearchPlaceholder');
      searchBox.style.cssText = 'display:block;width:calc(100% - 16px);margin:4px 8px;padding:4px 8px;border:1px solid var(--panel-border);border-radius:6px;background:var(--panel-bg);color:var(--panel-text-primary);font-size:11px;outline:none;';
      searchBox.addEventListener('input', () => {
        const kw = searchBox.value.toLowerCase();
        drop.querySelectorAll('button').forEach(b => {
          if (b.textContent.includes(t('foldersNewFolder'))) return;
          const text = b.getAttribute('data-folder-name') || b.textContent.replace(/[✎×]/g, '').trim();
          if (!b.hasAttribute('data-folder-name')) b.setAttribute('data-folder-name', text);
          if (!kw) { b.innerHTML = text; b.style.display = 'block'; return; }
          const idx = text.toLowerCase().indexOf(kw);
          if (idx === -1) { b.style.display = 'none'; return; }
          b.style.display = 'block';
          const before = text.slice(0, idx);
          const match = text.slice(idx, idx + kw.length);
          const after = text.slice(idx + kw.length);
          b.innerHTML = before + '<span style="background:var(--panel-danger,#ea4335);color:#fff;border-radius:3px;padding:1px 2px;">' + match + '</span>' + after;
        });
      });
      searchBox.addEventListener('click', (e) => e.stopPropagation());
      drop.appendChild(searchBox);
      bar.appendChild(addBtn);
      addBtn.style.cssText = 'display:block;width:100%;padding:6px 0;text-align:center;background:var(--panel-bg);border:none;border-top:1px solid var(--panel-border);color:var(--primary-color);font-size:16px;cursor:pointer;position:sticky;bottom:0;border-radius:0;';
      addBtn.textContent = t('foldersNewFolderBtn');
      while (bar.firstChild) drop.appendChild(bar.firstChild);
      wrapper.appendChild(trigger);
      wrapper.appendChild(drop);
      bar.appendChild(wrapper);
      trigger.addEventListener('click', (e) => { e.stopPropagation(); drop.style.display = drop.style.display === 'none' ? 'block' : 'none'; });
      document.addEventListener('click', (e) => { if (!wrapper.contains(e.target)) drop.style.display = 'none'; });
      drop.addEventListener('click', (e) => { const btn = e.target.closest('button'); if (btn && btn !== newBtn) { const raw = btn.textContent.replace(/[✎×]/g, '').trim(); trigger.textContent = raw === t('foldersAll') ? t('foldersCustom') : raw; drop.style.display = 'none'; } });
      // 根据当前选中的文件夹更新按钮文本
      if (state.selectedFolderId) {
        const selected = folders.find(f => f.id === state.selectedFolderId);
        trigger.textContent = selected ? selected.name : t('foldersCustom');
      } else {
        trigger.textContent = t('foldersCustom');
      }
      bar.style.display = 'inline-flex';
    });
  }

  function selectFolder(folderId) {
    state.selectedFolderId = folderId;
    injectFolderBar();
    loadBookmarkData();
  }

  async function createFolder() {
    const name = prompt(t('foldersCreatePrompt'));
    if (!name || !name.trim()) return;
    const folders = await storageGet('folders') || [];
    folders.push({ id: 'folder_' + Date.now(), name: name.trim(), createdAt: new Date().toISOString() });
    await storageSet('folders', folders);
    injectFolderBar();
    showToast(t('foldersCreated'));
  }

  async function renameFolder(folderId) {
    const folders = await storageGet('folders') || [];
    const f = folders.find(x => x.id === folderId);
    if (!f) return;
    const newName = prompt(t('foldersRenamePrompt'), f.name);
    if (!newName || !newName.trim()) return;
    f.name = newName.trim();
    await storageSet('folders', folders);
    injectFolderBar();
    showToast(t('foldersRenamed'));
  }

  async function deleteFolder(folderId) {
    const folders = await storageGet('folders') || [];
    const f = folders.find(x => x.id === folderId);
    if (!f) return;
    if (!confirm(t('foldersDeleteConfirmPrefix') + f.name + t('foldersDeleteConfirmSuffix'))) return;
    await storageSet('folders', folders.filter(x => x.id !== folderId));
    const clear = async (key) => {
      const items = await storageGet(key) || [];
      let changed = false;
      items.forEach(it => { if (it.folderId === folderId) { it.folderId = null; changed = true; } });
      if (changed) await storageSet(key, items);
    };
    await clear('bookmarks');
    await clear('messageBookmarks');
    if (state.selectedFolderId === folderId) state.selectedFolderId = '';
    injectFolderBar();
    loadBookmarkData();
    showToast(t('foldersDeleted'));
  }

  function showMoveToFolderDialog(storageKey, itemId) {
    storageGet('folders').then(folders => {
      folders = folders || [];
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:10000;';
let html = `<div style="background:var(--panel-bg);border-radius:14px;box-shadow:0 12px 48px rgba(0,0,0,0.25);padding:24px;width:33vw;min-width:280px;max-width:420px;"><h3 style="margin:0 0 12px;font-size:16px;font-weight:600;color:var(--panel-text-primary);display:flex;justify-content:space-between;align-items:center;">${t('foldersMoveTitle')}<span id="move-folder-count" style="font-size:13px;font-weight:400;color:var(--panel-text-secondary);"></span></h3><input type="text" class="move-folder-search" placeholder="${t('foldersSearchPlaceholder')}" style="display:block;width:100%;margin-bottom:8px;padding:6px 10px;border:1px solid var(--panel-border);border-radius:6px;background:var(--panel-bg);color:var(--panel-text-primary);font-size:12px;outline:none;"><div class="show-move-folder-scroll" style="max-height:50vh;overflow-y:scroll;padding-right:4px;"><div style="display:flex;flex-direction:column;gap:6px;">`;
      html += '<button data-folder-id="" data-folder-name="' + t('foldersMoveAll') + '" class="move-folder-btn" style="padding:8px 16px;border:1.5px solid var(--panel-border);border-radius:8px;background:var(--panel-bg);color:var(--panel-text-secondary);font-size:13px;cursor:pointer;font-family:inherit;transition:transform 0.15s,background 0.15s;">' + t('foldersMoveAll') + '</button>';
      folders.forEach(f => {
        html += '<button data-folder-id="' + escapeHTML(f.id) + '" data-folder-name="' + escapeHTML(f.name) + '" class="move-folder-btn" style="padding:8px 16px;border:1.5px solid var(--panel-border);border-radius:8px;background:var(--panel-bg);color:var(--panel-text-secondary);font-size:13px;cursor:pointer;font-family:inherit;transition:transform 0.15s,background 0.15s;">' + escapeHTML(f.name) + '</button>';
      });
 html += `<button data-folder-id="cancel" class="move-folder-btn" style="padding:8px 16px;border:1.5px solid var(--panel-danger);border-radius:8px;background:transparent;color:var(--panel-danger);font-size:13px;cursor:pointer;margin-top:8px;font-family:inherit;transition:transform 0.15s,background 0.15s;">${t('cancel')}</button>`;
      html += '</div></div></div>';
    overlay.innerHTML = html;
    document.body.appendChild(overlay);
    const countEl = document.getElementById('move-folder-count');
    if (countEl) countEl.textContent = `(${folders.length})`;
    // 搜索框过滤 + 高亮
    const moveSearch = overlay.querySelector('.move-folder-search');
    if (moveSearch) {
      moveSearch.addEventListener('input', () => {
        const kw = moveSearch.value.toLowerCase();
        let matchCount = 0;
        overlay.querySelectorAll('.move-folder-btn').forEach(b => {
          if (b.getAttribute('data-folder-id') === 'cancel') return;
          const text = b.getAttribute('data-folder-name') || b.textContent.trim();
          if (!kw) { b.innerHTML = text; b.style.display = 'block'; matchCount++; return; }
          const idx = text.toLowerCase().indexOf(kw);
          if (idx === -1) { b.style.display = 'none'; return; }
          b.style.display = 'block';
          matchCount++;
          b.innerHTML = text.slice(0, idx) + '<span style="background:var(--panel-danger,#ea4335);color:#fff;border-radius:3px;padding:1px 2px;">' + text.slice(idx, idx + kw.length) + '</span>' + text.slice(idx + kw.length);
        });
        const countEl = document.getElementById('move-folder-count');
        if (countEl) countEl.textContent = kw ? t('foldersMoveMatch') + ' ' + matchCount : '';
      });
    }
      const cleanup = () => overlay.remove();
      overlay.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', async () => {
          const fid = btn.getAttribute('data-folder-id');
          if (fid === 'cancel') { cleanup(); return; }
          const items = await storageGet(storageKey) || [];
          const item = items.find(it => it.id === itemId);
          if (item) { item.folderId = fid || null; await storageSet(storageKey, items); }
          cleanup();
          injectFolderBar();
          loadBookmarkData();
          showToast(t('foldersMoved'));
        });
      });
      overlay.addEventListener('click', (e) => { if (e.target === overlay) cleanup(); });
    });
  }

  // ==================== 收藏夹统计条 ====================

function ensureBookmarkStatsBar() {
  console.debug;
  let statsBar = document.getElementById('bookmark-stats');
  if (!statsBar && dom.bookmarkList && dom.bookmarkList.parentNode) {
    statsBar = document.createElement('div');
    statsBar.id = 'bookmark-stats';
    statsBar.className = 'stats-bar';
    const folderBar = document.getElementById('ds-folder-bar');
    if (folderBar && folderBar.parentNode) {
      // 创建 flex 行容器包裹文件夹栏和统计条
      let row = document.getElementById('folder-stats-row');
      if (!row) {
        row = document.createElement('div');
        row.id = 'folder-stats-row';
        row.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:8px;';
        folderBar.parentNode.insertBefore(row, folderBar);
        row.appendChild(folderBar);
        folderBar.style.display = ''; // 清除内联 display，使 flex 布局生效
      }
      row.appendChild(statsBar);
    } else {
      dom.bookmarkList.parentNode.insertBefore(statsBar, dom.bookmarkList);
    }
  }
}

  function updateBookmarkStats(convCount, msgCount, folderId, convToday = 0, convWeek = 0, msgToday = 0, msgWeek = 0) {
    const statsBar = document.getElementById('bookmark-stats');
    if (!statsBar) return;

    let folderDisplay = t('foldersStatsAll');
    if (folderId) {
      // 尝试从文件夹栏获取名称（避免重复查询 storage）
      const folderBtn = document.querySelector(`#ds-folder-bar button[data-folder-id="${folderId}"]`);
      if (folderBtn) folderDisplay = folderBtn.textContent.replace(/[✎×]/g, '').trim();
      else folderDisplay = t('foldersStatsSelected');
    }

  const totalToday = convToday + msgToday;
  const totalWeek = convWeek + msgWeek;
  statsBar.innerHTML = `
  <div style="display:flex;gap:10px;">
    <div class="stats-item">
      <span><span class="stats-icon">💬</span><span class="stats-number">${convCount}</span></span>
      <span class="stats-sublabel">${t('foldersStatsConv')}</span>
    </div>
    <div class="stats-item">
      <span><span class="stats-icon">📝</span><span class="stats-number">${msgCount}</span></span>
      <span class="stats-sublabel">${t('foldersStatsMsg')}</span>
    </div>
  </div>
  <div class="stats-delta">${totalToday > 0 ? `${t('foldersDeltaToday')}${totalToday}` : ''}${totalWeek > 0 ? (totalToday > 0 ? ' ' : '') + `${t('foldersDeltaWeek')}${totalWeek}` : ''}</div>
`;
  }

  // 单独刷新统计条（不重新加载整个列表）
  async function refreshBookmarkStats() {
    const bookmarks = await storageGet('bookmarks') || [];
    const messageBookmarks = await storageGet('messageBookmarks') || [];
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)).getTime();
    const isToday = ts => ts >= todayStart;
    const isWeek = ts => ts >= weekStart;
    let conv = bookmarks, msg = messageBookmarks;
    if (state.selectedFolderId) {
    conv = conv.filter(b => (b.folderId || null) === state.selectedFolderId);
    msg = msg.filter(m => (m.folderId || null) === state.selectedFolderId);
   }
   updateBookmarkStats(conv.length, msg.length, state.selectedFolderId,
     conv.filter(b => isToday(b.timestamp)).length,
     conv.filter(b => isWeek(b.timestamp)).length,
     msg.filter(m => isToday(m.timestamp)).length,
     msg.filter(m => isWeek(m.timestamp)).length);
}

