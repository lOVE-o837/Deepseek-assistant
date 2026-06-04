// panel.js — 主控文件，保留 init / switchTab / 事件绑定
// ============================================================
// panel.js — 主控文件（全局状态、初始化、事件绑定）
// 依赖加载顺序（在 panel.html 中按此顺序引入）：
//   module-i18n.js → module-storage.js → module-dom.js →
//   module-theme.js → module-panel.js → module-history.js →
//   module-search.js → module-bookmarks.js → module-messages.js →
//   module-folders.js → panel.js
// ============================================================
  const state = {
    currentTab: 'history-search',
    theme: 'deep-blue',           // 当前主题 ID
    customThemeColors: null,      // { primary, bg, text } 或 null
    fontSize: 'medium',
    enableFloatButton: true,
    settings: {},
    historySortOrder: 'desc',     // 'desc' = 时间倒序(新→旧), 'asc' = 时间正序(旧→新)
    currentSortOrder: 'desc',     // 当前对话搜索排序
    currentSearchResults: [],     // 缓存当前搜索结果
    currentSearchQuery: '',       // 缓存当前搜索关键词
    selectedFolderId: '',         // 当前选中的文件夹ID（空=全部）
    showAbsoluteTime: false       // 是否显示绝对时间（默认相对时间）
  };

  // 历史搜索缓存
  let historyCache = {
    conversations: null,
    timestamp: 0,
    query: ''
  };
  const CACHE_TTL = 5 * 60 * 1000; // 5分钟  

let dom = {};

  function cacheDOMElements() {
    dom.body = document.body;
    dom.panelContainer = document.getElementById('ds-assistant-panel');
    dom.btnMinimize = document.getElementById('btn-minimize');
    dom.btnResetPosition = document.getElementById('btn-reset-position');
    dom.btnClose = document.getElementById('btn-close');
    dom.tabBtns = document.querySelectorAll('.tab-btn');
    dom.tabContents = document.querySelectorAll('.tab-content');
    dom.toastContainer = document.getElementById('toast-container');

    // 历史搜索
    dom.historySearchInput = document.getElementById('history-search-input');
    dom.btnClearHistory = document.getElementById('btn-clear-history');
    dom.historyCount = document.getElementById('history-count');
    dom.historyList = document.getElementById('history-list');
    dom.btnHistorySort = document.getElementById('btn-history-sort');
    dom.btnHistorySortLabel = document.getElementById('btn-history-sort-label');
    dom.btnHistoryRefresh = document.getElementById('btn-history-refresh');
    dom.btnHistoryExport = document.getElementById('btn-history-export');

    // 当前对话搜索
    dom.currentSearchInput = document.getElementById('current-search-input');
    dom.btnCurrentSearchExec = document.getElementById('btn-current-search-exec');
    dom.btnCurrentSort = document.getElementById('btn-current-sort');
    dom.btnCurrentSortLabel = document.getElementById('btn-current-sort-label');
    dom.currentSearchCount = document.getElementById('current-search-count');
    dom.currentSearchResults = document.getElementById('current-search-results');

    // 收藏夹
    dom.bookmarkSearchInput = document.getElementById('bookmark-search-input');
    dom.bookmarkSort = document.getElementById('bookmark-sort');
    dom.btnBookmarkOps = document.getElementById('btn-bookmark-ops');
    dom.bookmarkOpsMenu = document.getElementById('bookmark-ops-menu');
    dom.importFileInput = document.getElementById('import-file-input');
    dom.bookmarkCount = document.getElementById('bookmark-count');
    dom.bookmarkList = document.getElementById('bookmark-list');
    dom.messageBookmarkList = document.getElementById('message-bookmark-list');

    // 主题
    dom.themeCardGrid = document.getElementById('theme-card-grid');
    dom.toggleFloatBtn = document.getElementById('toggle-float-btn');
    dom.btnResetSettings = document.getElementById('btn-reset-settings');

    // 颜色取色器
    dom.colorPickerModal = document.getElementById('color-picker-modal');
    dom.customColorPrimary = document.getElementById('custom-color-primary');
    dom.customColorBg = document.getElementById('custom-color-bg');
    dom.customColorText = document.getElementById('custom-color-text');
    dom.customColorPrimaryVal = document.getElementById('custom-color-primary-val');
    dom.customColorBgVal = document.getElementById('custom-color-bg-val');
    dom.customColorTextVal = document.getElementById('custom-color-text-val');
    dom.colorPreviewArea = document.getElementById('color-preview-area');
    dom.btnColorPickerCancel = document.getElementById('btn-color-picker-cancel');
    dom.btnColorPickerSave = document.getElementById('btn-color-picker-save');

    // 关于 - 使用独立 HTML 文件加载
  }



  // ==================== 初始化 ====================

  async function init() {
    cacheDOMElements();

    // 初始化历史搜索工具栏文本
    if (dom.historySearchInput) dom.historySearchInput.placeholder = t('historySearchPlaceholder');
    updateHistoryToolbarText();

    // 动态修改"关于"标签为"设置"
    const aboutBtn = document.querySelector('.tab-btn[data-tab="about"]');
    if (aboutBtn) {
      const icon = aboutBtn.querySelector('.tab-icon');
      const label = aboutBtn.querySelector('.tab-label');
      if (icon) icon.innerHTML = '&#9881;&#65039;';
      if (label) label.textContent = t('tabAbout');
      // 同时缩短“当前对话搜索”为“对话搜索”
      const currentTabBtn = document.querySelector('.tab-btn[data-tab="current-search"]');
      if (currentTabBtn) {
        const cl = currentTabBtn.querySelector('.tab-label');
        if (cl) cl.textContent = t('tabCurrentSearch');
      }
    }

    // 加载语言偏好
    const preferredLanguage = await storageGet('preferred_language');
    state.preferredLanguage = preferredLanguage || 'zh';

    // 加载设置
    const settings = await storageGet('settings');
    if (settings) {
      state.theme = settings.theme || 'deep-blue';
      state.customThemeColors = settings.customThemeColors || null;
      state.fontSize = settings.fontSize || 'medium';
      state.enableFloatButton = settings.enableFloatButton !== false;
      state.showAbsoluteTime = settings.showAbsoluteTime === true;
      state.settings = settings;
    } else {
      // 默认设置
      state.theme = 'deep-blue';
      state.customThemeColors = null;
      state.fontSize = 'medium';
      state.enableFloatButton = true;
      state.settings = {
        theme: 'deep-blue',
        customThemeColors: null,
        fontSize: 'medium',
        enableFloatButton: true,
        maxHistoryItems: 50
      };
      await storageSet('settings', state.settings);
    }

    // 如果自定义主题有保存值，更新 THEME_DEFINITIONS
    if (state.customThemeColors) {
      THEME_DEFINITIONS['custom'].primary = state.customThemeColors.primary;
      THEME_DEFINITIONS['custom'].bg = state.customThemeColors.bg;
      THEME_DEFINITIONS['custom'].text = state.customThemeColors.text;
      THEME_DEFINITIONS['custom'].name = t('themeNameMyCustom');
    }

    // 应用主题
    applyTheme(state.theme);

    // 应用字体大小
    applyFontSize(state.fontSize);

    // 渲染主题卡片
    renderThemeCards();

    // 初始化浮动按钮开关状态
    if (dom.toggleFloatBtn) {
      dom.toggleFloatBtn.checked = state.enableFloatButton;
    }

    // 设置事件监听
    setupEventListeners();

    // 加载各标签页数据
    // 历史搜索：等待 content-ready 信号而不是立即请求
    if (contentReady) {
      loadHistoryData();
    } else {
      // 显示加载占位
      if (dom.historyList) {
        dom.historyList.innerHTML = '<div class="empty-state"><span class="empty-icon">&#x1F4AD;</span><p>' + t('connecting') + '</p><p class="empty-hint">' + t('waitingForPageReady') + '</p></div>';
      }
      if (dom.historyCount) {
        dom.historyCount.textContent = t('connectingPage');
      }
      startContentReadyFallback();
    }
      loadBookmarkData();
      // （聚焦逻辑已移至 content-ready 事件与标签页切换中，此处不再需要）

    // 监听 chrome.storage 变更（messageBookmarks 写入时自动刷新消息卡片列表）
    // ★ 不依赖 chrome.runtime.sendMessage 跨上下文传递，比消息监听更可靠
    chrome.storage.onChanged.addListener(function(changes, areaName) {
      if (areaName === 'local') {
        if (changes.messageBookmarks && dom.messageBookmarkList) {
          renderMessageBookmarks();
        }
        if (changes.bookmarks) {
          loadBookmarkData();
    // 强制刷新收藏夹 UI 文本
          updateBookmarkUI();
        }
      }
    });

    // 初始化搜索 & 收藏夹静态文本（国际化）
    var si = document.getElementById('current-search-input');
    if (si) si.placeholder = t('searchInputPlaceholder');
    var sb = document.getElementById('btn-current-search-exec');
    if (sb) sb.textContent = t('searchExecBtn');
    var et = document.querySelector('#tab-current-search .empty-state p:first-child');
    if (et) et.textContent = t('searchEmptyTitle');
    var eh = document.querySelector('#tab-current-search .empty-hint');
    if (eh) eh.textContent = t('searchEmptyHint');
    document.querySelectorAll('#bookmark-sort option').forEach(function(o) {
      var m = { newest: 'bookmarkSortNewest', oldest: 'bookmarkSortOldest', title: 'bookmarkSortTitle' };
      if (m[o.value]) o.textContent = t(m[o.value]);
    });
    var ob = document.getElementById('btn-bookmark-ops');
    if (ob) ob.textContent = t('bookmarkOpsBtn');
    document.querySelectorAll('#bookmark-ops-menu [data-action]').forEach(function(b) {
      var m = { export: 'bookmarkOpsExport', import: 'bookmarkOpsImport', clear: 'bookmarkOpsClear' };
      if (m[b.getAttribute('data-action')]) b.textContent = t(m[b.getAttribute('data-action')]);
    });

    // 初始化主题界面静态文本
    var themeIds = {
      'theme-section-title': 'themeTitle',
      'theme-font-size-label': 'themeFontSize',
      'theme-font-small': 'themeFontSmall',
      'theme-font-medium': 'themeFontMedium',
      'theme-font-large': 'themeFontLarge',
      'theme-float-btn-label': 'themeFloatBtn',
      'theme-float-btn-desc': 'themeFloatBtnDesc',
      'theme-reset-btn-label': 'themeReset'
    };
    for (var id in themeIds) {
      var el = document.getElementById(id);
      if (el) el.textContent = t(themeIds[id]);
    }

    // 初始化标签栏按钮文本（国际化）
    document.querySelectorAll('.tab-btn').forEach(btn => {
      const tabId = btn.getAttribute('data-tab');
      const label = btn.querySelector('.tab-label');
      if (!label || !tabId) return;
      const i18nMap = {
        'history-search': 'tabHistorySearch',
        'current-search': 'tabCurrentSearch',
        'bookmarks': 'tabBookmarks',
        'theme': 'tabTheme',
        'about': 'tabAbout'
      };
      const key = i18nMap[tabId];
      if (key) label.textContent = t(key);
    });

    // 初始化当前对话搜索排序按钮文本
    var sortBtn = document.getElementById('btn-current-sort');
    if (sortBtn) {
      sortBtn.textContent = state.currentSortOrder === 'desc' ? t('searchSortAsc') : t('searchSortDesc');
    }

    // 初始化所有静态文本（data-i18n、占位符、特殊ID元素）
      // 初始化收藏夹空状态占位符
    var emptyPlaceholder = document.getElementById('bookmark-empty-placeholder');
    if (emptyPlaceholder && typeof getBookmarkEmptyHTML === 'function') {
      emptyPlaceholder.innerHTML = getBookmarkEmptyHTML();
    }

    // 初始化所有静态文本
    if (typeof refreshAllStaticText === 'function') {
      refreshAllStaticText();
    }
  }

// 暴露全局 API 到 window.DSAssistant，供 content.js 等外部脚本调用面板核心功能

  window.DSAssistant = {
    getState: () => state,
    switchTab,
    showToast,
    applyTheme,
    renderThemeCards,
    loadHistoryData,
    loadBookmarkData,
    renderBookmarkList: loadBookmarkData,
    renderHistoryList: loadHistoryData,
    getEffectiveTheme
  };

  // 添加搜索历史（供 content.js 调用）
  window.addSearchHistory = async function (entry) {
    let history = await storageGet('searchHistory') || [];
    history.unshift({
      query: entry.query || '',
      type: entry.type || '搜索',
      title: entry.title || '',
      url: entry.url || '',
      timestamp: Date.now()
    });
    // 限制数量
    const maxItems = state.settings.maxHistoryItems || 50;
    if (history.length > maxItems) {
      history = history.slice(0, maxItems);
    }
    await storageSet('searchHistory', history);
    if (state.currentTab === 'history-search') {
      loadHistoryData();
    }
  };



 // 重置所有设置为默认值：恢复深海蓝主题、中等字体、启用浮动按钮，清除自定义主题并同步到 content.js 
  async function resetSettings() {
    state.theme = 'deep-blue';
    state.customThemeColors = null;
    state.fontSize = 'medium';
    state.enableFloatButton = true;
    state.settings = {
      theme: 'deep-blue',
      customThemeColors: null,
      fontSize: 'medium',
      enableFloatButton: true,
      maxHistoryItems: 50
    };

    // 更新 THEME_DEFINITIONS
    THEME_DEFINITIONS['custom'].primary = '#1890ff';
    THEME_DEFINITIONS['custom'].bg = '#ffffff';
    THEME_DEFINITIONS['custom'].text = '#333333';
    THEME_DEFINITIONS['custom'].name = '创建我的主题';

    await saveSettings();

    // 清除自定义主题残留的内联 CSS 变量，确保默认主题样式生效
    // （applyCustomThemeVars() 会将变量设为 dom.body.style 内联样式，
    //   其优先级高于 CSS 类定义，必须清除后默认主题类才能生效）
    const defaultVars = computeThemeCSSVars('#1890ff', '#ffffff', '#333333');
    Object.keys(defaultVars).forEach(key => dom.body.style.removeProperty(key));

    // 应用默认主题
    applyTheme('deep-blue');
    applyFontSize('medium');

    // 更新浮动按钮开关
    if (dom.toggleFloatBtn) dom.toggleFloatBtn.checked = true;

    // 重新渲染卡片
    renderThemeCards();

    // 更新字体 radio
    document.querySelectorAll('.font-option input[type="radio"]').forEach(r => {
      r.checked = r.value === 'medium';
    });

    // 同步到 content
    safeSendMessage({
      action: 'settings-changed',
      settings: Object.assign({}, state.settings, { preferredLanguage: state.preferredLanguage })
    });

    showToast(t('themeResetDone'));
  }


  // ← IIFE 闭合，resetSettings 在此结束

    // ==================== 事件监听 ====================

  // ==================== 模块: 事件绑定 ====================
function setupEventListeners() {
    // 标签页切换
    dom.tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        switchTab(tabId);
      });
    });

    // 重置面板位置
    if (dom.btnResetPosition) {
      dom.btnResetPosition.addEventListener('click', () => {
        try {
          window.parent.postMessage({ action: 'reset-panel-position' }, '*');
        } catch (e) {}
      });
    }
    // 最小化
    if (dom.btnMinimize) {
      dom.btnMinimize.addEventListener('click', () => {
        resetDragTransform();
        try {
          window.parent.postMessage({ action: 'minimize-panel' }, '*');
        } catch (e) {}
      });
    }

    // 关闭
    if (dom.btnClose) {
      dom.btnClose.addEventListener('click', () => {
        resetDragTransform();
        try {
          window.parent.postMessage({ action: 'close-panel' }, '*');
        } catch (e) {}
        safeSendMessage({ action: 'close-panel' });
      });
    }

    // 浮动按钮开关
    if (dom.toggleFloatBtn) {
      dom.toggleFloatBtn.addEventListener('change', () => {
        state.enableFloatButton = dom.toggleFloatBtn.checked;
        saveSettings();
        safeSendMessage({
          action: 'toggle-float-btn',
          enabled: state.enableFloatButton
        });
      });
    }

    // 恢复默认设置
    if (dom.btnResetSettings) {
      dom.btnResetSettings.addEventListener('click', resetSettings);
    }

    // 字体大小
    const fontOptions = document.querySelectorAll('.font-option');
    fontOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        const font = opt.getAttribute('data-font');
        if (font) applyFontSize(font);

        // 更新 radio 状态
        fontOptions.forEach(o => {
          const radio = o.querySelector('input[type="radio"]');
          if (radio) radio.checked = false;
        });
        const radio = opt.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });

    // 历史搜索
    if (dom.historySearchInput) {
      dom.historySearchInput.addEventListener('input', debounce(loadHistoryData, 300));
      dom.historySearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          dom.historySearchInput.value = '';
          loadHistoryData();
        }
      });
    }
    if (dom.btnClearHistory) {
      dom.btnClearHistory.addEventListener('click', clearAllHistory);
    }
    if (dom.btnHistorySort) {
      dom.btnHistorySort.addEventListener('click', toggleHistorySort);
    }
    if (dom.btnHistoryRefresh) {
      let refreshLock = false;
      dom.btnHistoryRefresh.addEventListener('click', async () => {
        if (refreshLock) { showToast(t('historyRefreshBusy')); return; }
        refreshLock = true;
        dom.btnHistoryRefresh.disabled = true;
        try { await loadHistoryData(true); showToast(t('historyRefreshed')); }
        catch (e) { showToast(t('historyRefreshFailed')); }
        finally { refreshLock = false; dom.btnHistoryRefresh.disabled = false; }
      });
    }
    if (dom.btnHistoryExport) {
      dom.btnHistoryExport.addEventListener('click', exportHistoryToCSV);
    }

    // 当前对话搜索
    if (dom.currentSearchInput) {
      dom.currentSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') executeCurrentSearch();
        if (e.key === 'Escape') {
          dom.currentSearchInput.value = '';
          dom.currentSearchCount.textContent = t('searchTypeHint');
          dom.currentSearchResults.innerHTML = getSearchEmptyHTML();
        }
      });
    }
    if (dom.btnCurrentSearchExec) {
      dom.btnCurrentSearchExec.addEventListener('click', executeCurrentSearch);
    }
    if (dom.btnCurrentSort) {
      dom.btnCurrentSort.addEventListener('click', toggleCurrentSort);
    }

    // 收藏夹
    if (dom.bookmarkSearchInput) {
      dom.bookmarkSearchInput.addEventListener('input', () => {
        updateBookmarkSearchStats(); // 立即更新统计数字
        debouncedLoadBookmarkData(); // 防抖后重新渲染列表
      });
    }
    if (dom.bookmarkSort) {
      dom.bookmarkSort.addEventListener('change', loadBookmarkData);
    }
    // 操作下拉菜单
    if (dom.btnBookmarkOps) {
      dom.btnBookmarkOps.addEventListener('click', (e) => {
        e.stopPropagation();
        const menu = dom.bookmarkOpsMenu;
        if (menu) menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
      });
      // 点击其他地方关闭菜单
      document.addEventListener('click', (e) => {
        const menu = dom.bookmarkOpsMenu;
        if (menu && !menu.contains(e.target) && e.target !== dom.btnBookmarkOps) {
          menu.style.display = 'none';
        }
      });
    }
    if (dom.bookmarkOpsMenu) {
      dom.bookmarkOpsMenu.addEventListener('click', (e) => {
        const action = e.target.getAttribute('data-action');
        if (!action) return;
        dom.bookmarkOpsMenu.style.display = 'none';
        if (action === 'export') exportBookmarks();
        else if (action === 'import') { if (dom.importFileInput) dom.importFileInput.click(); }
        else if (action === 'clear') clearAllBookmarks();
      });
    }
    if (dom.importFileInput) {
      dom.importFileInput.addEventListener('change', importBookmarks);
    }
    // 显示绝对时间开关
    const toggleAbsTime = document.getElementById('toggle-absolute-time');
    if (toggleAbsTime) {
      toggleAbsTime.checked = state.showAbsoluteTime;
      toggleAbsTime.addEventListener('change', () => {
        state.showAbsoluteTime = toggleAbsTime.checked;
        saveSettings();
        loadBookmarkData();
      });
    }

    // 颜色取色器
    if (dom.customColorPrimary) {
      dom.customColorPrimary.addEventListener('input', () => {
        const val = dom.customColorPrimary.value;
        dom.customColorPrimaryVal.textContent = val;
        updateColorPreview(val, dom.customColorBg.value, dom.customColorText.value);
      });
    }
    if (dom.customColorBg) {
      dom.customColorBg.addEventListener('input', () => {
        const val = dom.customColorBg.value;
        dom.customColorBgVal.textContent = val;
        updateColorPreview(dom.customColorPrimary.value, val, dom.customColorText.value);
      });
    }
    if (dom.customColorText) {
      dom.customColorText.addEventListener('input', () => {
        const val = dom.customColorText.value;
        dom.customColorTextVal.textContent = val;
        updateColorPreview(dom.customColorPrimary.value, dom.customColorBg.value, val);
      });
    }
    if (dom.btnColorPickerCancel) {
      dom.btnColorPickerCancel.addEventListener('click', closeColorPicker);
    }
    if (dom.btnColorPickerSave) {
      dom.btnColorPickerSave.addEventListener('click', saveCustomTheme);
    }
    // 点击取色器遮罩关闭
    if (dom.colorPickerModal) {
      dom.colorPickerModal.addEventListener('click', (e) => {
        if (e.target === dom.colorPickerModal) {
          closeColorPicker();
        }
      });
    }

    // 键盘快捷键
    document.addEventListener('keydown', (e) => {
      // Esc 关闭取色器
      if (e.key === 'Escape' && dom.colorPickerModal && dom.colorPickerModal.style.display === 'flex') {
        closeColorPicker();
        e.preventDefault();
      }
      // Alt+K / Esc 关闭面板
      if (e.key === 'Escape') {
        try {
          window.parent.postMessage({ action: 'close-panel' }, '*');
        } catch (e2) {}
          safeSendMessage({ action: 'close-panel' });
      }
    });

    // 监听来自 content.js 的消息（通过 postMessage）
    window.addEventListener('message', (event) => {
      if (!event.data || !event.data.action) return;
      const { action } = event.data;

      switch (action) {
        case 'content-ready':
          // ★ 双向就绪握手：收到 content.js 的就绪信号
          contentReady = true;
          if (contentReadyFallbackTimer) {
            clearTimeout(contentReadyFallbackTimer);
            contentReadyFallbackTimer = null;
          }
          // 如果当前正在历史搜索标签页，立即加载并聚焦
          if (state.currentTab === 'history-search') {
            loadHistoryData();
            focusHistorySearchInput();
          }
          break;
        case 'new-bookmark':
          loadBookmarkData();
          break;
        case 'drag-move':
          onDragMove(event.data.left, event.data.top);
          break;
        case 'drag-end':
          onDragEnd(event.data.left, event.data.top);
          break;
        default:
          break;
      }
    });

    // 面板标题栏 mousedown → 开始拖动
    const panelHeader = document.querySelector('.panel-header');
    if (panelHeader) {
      let dragPending = false;
      let dragStartX = 0, dragStartY = 0;
      const DRAG_THRESHOLD = 5;
      panelHeader.addEventListener('mousedown', (e) => {
        if (e.target.closest('button, input, .header-btn')) return;
        e.preventDefault();
        dragPending = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
      });
      document.addEventListener('mousemove', (e) => {
        if (!dragPending) return;
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
          dragPending = false;
          try {
            window.parent.postMessage({
              action: 'drag-start',
              offsetX: dragStartX,
              offsetY: dragStartY
            }, '*');
          } catch (err) {}
        }
      });
      document.addEventListener('mouseup', () => { dragPending = false; });
      panelHeader.addEventListener('dragstart', (e) => e.preventDefault());
    }

    // 设置跟随系统主题监听
    setupSystemThemeListener();
  }

    // ==================== 启动 ====================

  if (typeof pingDailyActive === 'function') pingDailyActive();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }