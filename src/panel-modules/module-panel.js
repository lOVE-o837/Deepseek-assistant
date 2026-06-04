// module-panel.js
// ==================== 模块: 标签切换与面板控制 ====================
function switchTab(tabId) {
    state.currentTab = tabId;

    // 更新标签按钮
    dom.tabBtns.forEach(btn => {
      const btnTab = btn.getAttribute('data-tab');
      if (btnTab === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // "关于"标签：用 JS 注入干净的内联 HTML
    if (tabId === 'about') {
      const aboutTab = document.getElementById('tab-about');
      if (aboutTab) {
const savedLang = state.preferredLanguage || 'zh';
const langNames = { zh: '中文', en: 'English', ru: 'Русский', id: 'Bahasa Indonesia', pt: 'Português', vi: 'Tiếng Việt' };
const currentLangName = langNames[savedLang] || 'English';
aboutTab.innerHTML = `<div id="settings-root" style="display:flex; flex-direction:column; height:100%; color:var(--panel-text-primary);">
  <div style="flex-shrink:0; padding-bottom:16px; border-bottom:1px solid rgba(128,128,128,0.1);">
    <h2 style="margin:0 0 4px 0;">${t('settingsTitle')}</h2>
    <p style="opacity:0.7; margin:0; font-size:13px;">${t('settingsVersion')}</p>
  </div>
  <div style="flex:1; overflow-y:auto; padding-top:16px;" id="settings-main-view">
    <div style="display:flex; flex-direction:column; gap:12px;">
      <button class="settings-menu-btn" id="btn-language-settings" style="display:flex; align-items:center; width:100%; padding:14px; border:1px solid rgba(128,128,128,0.15); border-radius:8px; background:rgba(128,128,128,0.02); cursor:pointer; text-align:left;">
        <span style="font-size:18px; margin-right:12px;">🌐</span>
        <div style="flex:1;"><div style="font-weight:600; color:var(--panel-text-primary);">${t('settingsLanguage')}</div><div style="font-size:12px; opacity:0.7; color:var(--panel-text-primary);" id="current-lang-label">${currentLangName}</div></div>
        <span style="font-size:14px; opacity:0.4;">›</span>
      </button>
      <button class="settings-menu-btn" id="btn-about-details" style="display:flex; align-items:center; width:100%; padding:14px; border:1px solid rgba(128,128,128,0.15); border-radius:8px; background:rgba(128,128,128,0.02); cursor:pointer; text-align:left;">
        <span style="font-size:18px; margin-right:12px;">ℹ️</span>
        <div style="flex:1;"><div style="font-weight:600; color:var(--panel-text-primary);">${t('settingsAboutDetails')}</div><div style="font-size:12px; opacity:0.7; color:var(--panel-text-primary);">${t('settingsAboutDetailsDesc')}</div></div>
        <span style="font-size:14px; opacity:0.4;">›</span>
      </button>
      <div class="settings-card" id="card-bookmark-stats" style="padding:14px; border-radius:12px; background:rgba(33,150,243,0.06); border:1px solid rgba(33,150,243,0.12);">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
          <span style="font-weight:600; font-size:14px;">${t('settingsCardStats')}</span>
          <span style="font-size:13px; font-weight:700; color:var(--panel-accent);"><span id="stats-total-label">${t('totalText')}</span> <span id="stats-total-num">0</span></span>
        </div>
        <div id="stats-folder-name" style="font-size:12px; color:var(--panel-accent); margin-bottom:6px; display:none;"></div>
        <div style="display:flex; gap:16px; font-size:13px;">
          <span><span id="stats-conv-label">${t('settingsConvLabel')}</span> <strong id="stats-conv-count">0</strong></span>
          <span><span id="stats-msg-label">${t('settingsMsgLabel')}</span> <strong id="stats-msg-count">0</strong></span>        </div>
      </div>
      <div class="settings-card" id="card-quick-actions" style="padding:14px; border-radius:12px; background:rgba(156,39,176,0.04); border:1px solid rgba(156,39,176,0.1);">
        <div style="font-weight:600; font-size:14px; margin-bottom:10px;">${t('settingsCardQuick')}</div>
        <div style="display:flex; gap:8px;">
          <button id="btn-quick-export-json" style="flex:1; padding:8px 0; border:1px solid rgba(128,128,128,0.2); border-radius:8px; background:var(--panel-bg); color:var(--panel-text-primary); cursor:pointer; font-size:13px;">${t('settingsExportJson')}</button>
          <button id="btn-quick-goto-bookmarks" style="flex:1; padding:8px 0; border:1px solid rgba(128,128,128,0.2); border-radius:8px; background:var(--panel-bg); color:var(--panel-text-primary); cursor:pointer; font-size:13px;">${t('settingsOpenBookmarks')}</button>
        </div>
      </div>
      <div class="settings-card" id="card-storage-usage" style="padding:14px; border-radius:12px; background:rgba(128,128,128,0.03); border:1px solid rgba(128,128,128,0.1);">
        <div style="display:flex; align-items:center; justify-content:space-between;">
          <span style="font-weight:600; font-size:14px;">${t('settingsStorageUsage')}</span>
          <span style="font-size:13px; opacity:0.8;" id="storage-usage-text">-- MB / 10 MB</span>
        </div>
      </div>
      <div class="settings-card" id="card-safety-tips" style="padding:14px; border-radius:12px; background:rgba(255,152,0,0.05); border:1px solid rgba(255,152,0,0.12);">
        <div style="font-weight:600; font-size:14px; margin-bottom:6px;">${t('settingsCardSafety')}</div>
        <ul style="margin:0; padding-left:16px; font-size:12px; opacity:0.85; line-height:1.6;">
          <li>${t('settingsSafety1')}</li>
          <li>${t('settingsSafety2')}</li>
        </ul>
      </div>
    </div>
  </div>
  <div style="flex-shrink:0; margin-top:16px; padding-top:12px; border-top:1px solid rgba(128,128,128,0.15); font-size:11px; opacity:0.6; text-align:center;">    <p style="margin:0 0 4px 0;">${t('settingsPrivacy')}</p>
        <p style="margin:0;">${t('settingsFooter')}</p>
  </div>
</div>`;
      }

      // 绑定主菜单按钮事件
      const btnLang = document.getElementById('btn-language-settings');
      const btnAbout = document.getElementById('btn-about-details');
      if (btnLang) btnLang.addEventListener('click', () => showSubView('language'));
      if (btnAbout) btnAbout.addEventListener('click', () => showSubView('about-details'));
      // 从收藏夹统计条直接读取数字
      const statsNumbers = document.querySelectorAll('#bookmark-stats .stats-number');
      const convCount = statsNumbers[0] ? parseInt(statsNumbers[0].textContent) || 0 : 0;
      const msgCount = statsNumbers[1] ? parseInt(statsNumbers[1].textContent) || 0 : 0;
      document.getElementById('stats-conv-count') && (document.getElementById('stats-conv-count').textContent = convCount);
      document.getElementById('stats-msg-count') && (document.getElementById('stats-msg-count').textContent = msgCount);
      const totalLabel = document.getElementById('stats-total-label');
      const totalNum = document.getElementById('stats-total-num');
      if (totalLabel) totalLabel.textContent = t('totalText');
      if (totalNum) totalNum.textContent = convCount + msgCount;

      // 更新当前文件夹名称
      const folderNameEl = document.getElementById('stats-folder-name');
      if (folderNameEl) {
        const activeFolderBtn = document.querySelector('#ds-folder-bar button[style*="var(--panel-accent)"]');
        if (activeFolderBtn && state.selectedFolderId) {
          folderNameEl.textContent = '📁 ' + activeFolderBtn.textContent.replace('✎×', '').trim();
          folderNameEl.style.display = '';
        } else {
          folderNameEl.textContent = '';
          folderNameEl.style.display = 'none';
        }
      }
      // 绑定快捷操作按钮
      const btnExport = document.getElementById('btn-quick-export-json');
      const btnBookmarks = document.getElementById('btn-quick-goto-bookmarks');
      if (btnExport) btnExport.addEventListener('click', exportBookmarksDirect);
      if (btnBookmarks) btnBookmarks.addEventListener('click', () => switchTab('bookmarks'));

      // 获取存储用量并更新显示
      updateStorageUsage();

      // 清理可能残留的覆盖层
      const oldOverlay = document.getElementById('ds-about-overlay');
      if (oldOverlay) oldOverlay.remove();
      // 继续执行下面的标签页激活逻辑，不加 return
    }

    // 更新内容区
    dom.tabContents.forEach(content => {
      content.classList.remove('active');
    });

    const targetContent = document.getElementById('tab-' + tabId);
    if (targetContent) {
      targetContent.classList.add('active');
    }

    // 切换到主题标签时重新渲染（确保颜色预览最新）
    if (tabId === 'theme') {
      renderThemeCards();
    }

// 切换到历史搜索标签时自动抓取对话列表
    if (tabId === 'bookmarks') {
      injectFolderBar();
      // 刷新收藏夹搜索框占位符
      var bmkInput = document.getElementById('bookmark-search-input');
      if (bmkInput) bmkInput.placeholder = t('bookmarkSearchPlaceholder');
      
      // 强制刷新空状态：使用 getBookmarkEmptyHTML 函数，它已绕过 t()
      var bookmarkEmpty = document.querySelector('#bookmark-list .empty-state');
      if (bookmarkEmpty && typeof getBookmarkEmptyHTML === 'function') {
        bookmarkEmpty.innerHTML = getBookmarkEmptyHTML();
      }
      if (typeof renderMessageBookmarks === 'function') {
        renderMessageBookmarks();
      }
    }
    if (tabId === 'history-search') {
      // 聚焦历史搜索输入框
      focusHistorySearchInput();
      if (contentReady) {
        loadHistoryData();
      } else {
        // content 尚未就绪：显示加载提示，等待 content-ready 信号
        startContentReadyFallback();
      }
    }
    if (tabId === 'current-search') {
      // 聚焦当前对话搜索输入框
      setTimeout(() => {
        const input = document.getElementById('current-search-input');
        if (input && input.offsetParent !== null) {
          input.focus();
        }
      }, 50);
    }

    // 通知 content.js 语言变化，刷新动态菜单文本
    if (typeof safeSendMessage === 'function') {
      safeSendMessage({
        action: 'settings-changed',
        settings: {
          preferredLanguage: state.preferredLanguage
        }
      });
    }
  }

// 同步面板容器定位，与 content.js 的 iframe 定位保持一致
function onDragMove(left, top) {
    // content.js 负责 iframe 的定位（style.left/top on iframe）
    // 这里同步设置容器内定位，确保样式一致性
    const panel = document.getElementById('ds-assistant-panel');
    if (!panel) return;
    panel.style.position = 'fixed';
    panel.style.left = '0';
    panel.style.top = '0';
  }

// 拖拽结束后同步面板位置
  function onDragEnd(left, top) {
    onDragMove(left, top);
  }

// 清除面板的内联定位样式，恢复默认布局
  function resetDragTransform() {
    const panel = document.getElementById('ds-assistant-panel');
    if (!panel) return;
    panel.style.position = '';
    panel.style.left = '';
    panel.style.top = '';
  }


  // ==================== 设置子视图 ====================

  function showSubView(viewName) {
    const mainView = document.getElementById('settings-main-view');
    if (!mainView) return;
    let html = '';
    if (viewName === 'language') {
      const savedLang = state.preferredLanguage || detectBrowserLanguage();
      const languages = [
        { code: 'zh', name: '中文' }, { code: 'en', name: 'English' },
        { code: 'ru', name: 'Русский' }, { code: 'id', name: 'Bahasa Indonesia' },
        { code: 'pt', name: 'Português' }, { code: 'vi', name: 'Tiếng Việt' }
      ];
      html = `<div id="subview-language" style="display:flex; flex-direction:column; height:100%;">
        <div style="display:flex; align-items:center; margin-bottom:12px;">
          <button id="btn-back-main" style="background:none; border:none; cursor:pointer; font-size:18px; margin-right:8px;">←</button>
          <span style="font-weight:600;">${t('langSelectTitle')}</span>
        </div>
        <input id="lang-search-input" type="text" placeholder="${t('langSearchPlaceholder')}" style="margin-bottom:12px; padding:8px; border-radius:6px; border:1px solid rgba(128,128,128,0.2); background:var(--panel-bg); color:var(--panel-text-primary);">
        <div style="flex:1; overflow-y:auto; overflow-x:hidden;" id="lang-list-container">`;
      languages.forEach(l => {
        const isActive = (l.code === savedLang) ? ' style="font-weight:600; color: var(--panel-accent);"' : '';
        html += `<div class="lang-option" data-lang="${l.code}"${isActive} style="padding:10px; border-bottom:1px solid rgba(128,128,128,0.05); cursor:pointer;">${l.name}</div>`;
      });
      html += `</div></div>`;
    } else if (viewName === 'about-details') {
      html = `<div style="display:flex; flex-direction:column; height:100%;">
        <div style="display:flex; align-items:center; margin-bottom:12px;">
          <button id="btn-back-main" style="background:none; border:none; cursor:pointer; font-size:18px; margin-right:8px;">←</button>
          <span style="font-weight:600;">${t('aboutDetailsTitle')}</span>
        </div>
        <div style="flex:1; overflow-y:auto;">
          <h3 style="margin-top:0;">${t('aboutDetailsFeatures')}</h3>
<ul style="padding-left:0; list-style: none;">
    <li style="display:flex; gap:0; margin-bottom:10px; line-height:1.8; letter-spacing:0.5px; font-weight:400; font-size:13px; color:var(--panel-text-primary);">
        <span style="flex-shrink:0; width:140px;">${t('featHistory').replace(/ — .*/, ' —')}</span>
        <span style="flex:1;">${t('featHistory').replace(/.*? — /, '')}</span>
    </li>
    <li style="display:flex; gap:0; margin-bottom:10px; line-height:1.8; letter-spacing:0.5px; font-weight:400; font-size:13px; color:var(--panel-text-primary);">
        <span style="flex-shrink:0; width:140px;">${t('featCurrent').replace(/ — .*/, ' —')}</span>
        <span style="flex:1;">${t('featCurrent').replace(/.*? — /, '')}</span>
    </li>
    <li style="display:flex; gap:0; margin-bottom:10px; line-height:1.8; letter-spacing:0.5px; font-weight:400; font-size:13px; color:var(--panel-text-primary);">
        <span style="flex-shrink:0; width:140px;">${t('featBookmarks').replace(/ — .*/, ' —')}</span>
        <span style="flex:1;">${t('featBookmarks').replace(/.*? — /, '')}</span>
    </li>
    <li style="display:flex; gap:0; margin-bottom:10px; line-height:1.8; letter-spacing:0.5px; font-weight:400; font-size:13px; color:var(--panel-text-primary);">
        <span style="flex-shrink:0; width:140px;">${t('featFolders').replace(/ — .*/, ' —')}</span>
        <span style="flex:1;">${t('featFolders').replace(/.*? — /, '')}</span>
    </li>
    <li style="display:flex; gap:0; margin-bottom:10px; line-height:1.8; letter-spacing:0.5px; font-weight:400; font-size:13px; color:var(--panel-text-primary);">
        <span style="flex-shrink:0; width:140px;">${t('featMsgBookmarks').replace(/ — .*/, ' —')}</span>
        <span style="flex:1;">${t('featMsgBookmarks').replace(/.*? — /, '')}</span>
    </li>
    <li style="display:flex; gap:0; margin-bottom:10px; line-height:1.8; letter-spacing:0.5px; font-weight:400; font-size:13px; color:var(--panel-text-primary);">
        <span style="flex-shrink:0; width:140px;">${t('featStats').replace(/ — .*/, ' —')}</span>
        <span style="flex:1;">${t('featStats').replace(/.*? — /, '')}</span>
    </li>
    <li style="display:flex; gap:0; margin-bottom:10px; line-height:1.8; letter-spacing:0.5px; font-weight:400; font-size:13px; color:var(--panel-text-primary);">
        <span style="flex-shrink:0; width:140px;">${t('featTheme').replace(/ — .*/, ' —')}</span>
        <span style="flex:1;">${t('featTheme').replace(/.*? — /, '')}</span>
    </li>
    <li style="display:flex; gap:0; margin-bottom:10px; line-height:1.8; letter-spacing:0.5px; font-weight:400; font-size:13px; color:var(--panel-text-primary);">
        <span style="flex-shrink:0; width:140px;">${t('featDrag').replace(/ — .*/, ' —')}</span>
        <span style="flex:1;">${t('featDrag').replace(/.*? — /, '')}</span>
    </li>
    <li style="display:flex; gap:0; margin-bottom:10px; line-height:1.8; letter-spacing:0.5px; font-weight:400; font-size:13px; color:var(--panel-text-primary);">
        <span style="flex-shrink:0; width:140px;">${t('featFloatBtn').replace(/ — .*/, ' —')}</span>
        <span style="flex:1;">${t('featFloatBtn').replace(/.*? — /, '')}</span>
    </li>
    <li style="display:flex; gap:0; margin-bottom:10px; line-height:1.8; letter-spacing:0.5px; font-weight:400; font-size:13px; color:var(--panel-text-primary);">
        <span style="flex-shrink:0; width:140px;">${t('featAbsTime').replace(/ — .*/, ' —')}</span>
        <span style="flex:1;">${t('featAbsTime').replace(/.*? — /, '')}</span>
    </li>
    <li style="display:flex; gap:0; margin-bottom:10px; line-height:1.8; letter-spacing:0.5px; font-weight:400; font-size:13px; color:var(--panel-text-primary);">
        <span style="flex-shrink:0; width:140px;">${t('featClearAll').replace(/ — .*/, ' —')}</span>
        <span style="flex:1;">${t('featClearAll').replace(/.*? — /, '')}</span>
    </li>
    <li style="display:flex; gap:0; margin-bottom:10px; line-height:1.8; letter-spacing:0.5px; font-weight:400; font-size:13px; color:var(--panel-text-primary);">
        <span style="flex-shrink:0; width:140px;">${t('featReset').replace(/ — .*/, ' —')}</span>
        <span style="flex:1;">${t('featReset').replace(/.*? — /, '')}</span>
    </li>
</ul>
          <h3>${t('shortcutTitle')}</h3>
          <table style="width:100%; border-collapse:collapse;">
            <tr><td style="padding:6px 0;"><kbd>Alt</kbd> + <kbd>K</kbd></td><td>${t('shortcutAltK')}</td></tr>
            <tr><td style="padding:6px 0;"><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>X</kbd></td><td>${t('shortcutCtrlShiftX')}</td></tr>
            <tr><td style="padding:6px 0;"><kbd>Esc</kbd></td><td>${t('shortcutEsc')}</td></tr>
            <tr><td style="padding:6px 0;"><kbd>Enter</kbd></td><td>${t('shortcutEnter')}</td></tr>
          </table>
        </div>
      </div>`;
    }
    mainView.innerHTML = html;

    // 统一绑定返回按钮
    const backBtn = document.getElementById('btn-back-main');
    if (backBtn) backBtn.addEventListener('click', showMainView);

    // 如果是语言视图，绑定搜索和点击
    if (viewName === 'language') {
      const searchInput = document.getElementById('lang-search-input');
      if (searchInput) searchInput.addEventListener('input', function(e) {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll('.lang-option').forEach(el => {
          el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      });
      document.querySelectorAll('.lang-option').forEach(el => {
        el.addEventListener('click', function() { switchLanguage(this.dataset.lang); });
      });
    }
  }

  function showMainView() {
    const mainView = document.getElementById('settings-main-view');
    if (!mainView) return;
    // 简单重建主视图（复用 switchTab 中的初始化逻辑）
    if (typeof switchTab === 'function') switchTab('about');
  }

   async function updateStorageUsage() {
    const usageText = document.getElementById('storage-usage-text');
    if (!usageText) return;
    const QUOTA = 10 * 1024 * 1024; // 10MB
    try {
      const bytes = await new Promise(resolve => chrome.storage.local.getBytesInUse(null, resolve));
      const mb = bytes / (1024 * 1024);
      const pct = (bytes / QUOTA * 100).toFixed(2);
      if (mb < 0.1) {
        usageText.textContent = (bytes / 1024).toFixed(0) + ' KB / 10 MB (' + pct + '%)';
      } else {
        usageText.textContent = mb.toFixed(1) + ' MB / 10 MB (' + pct + '%)';
      }
      usageText.style.color = pct >= 95 ? '#e53935' : pct >= 80 ? '#ef6c00' : '';
    } catch (e) {
      usageText.textContent = '-- MB / 10 MB';
    }
  }