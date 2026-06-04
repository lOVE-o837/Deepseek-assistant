// module-theme.js
// ==================== 模块: 颜色工具 ====================
function hexToRgb(hex) {
    const h = hex.replace('#', '');
    if (h.length === 3) {
      return [
        parseInt(h[0] + h[0], 16),
        parseInt(h[1] + h[1], 16),
        parseInt(h[2] + h[2], 16)
      ];
    }
    return [
      parseInt(h.substring(0, 2), 16),
      parseInt(h.substring(2, 4), 16),
      parseInt(h.substring(4, 6), 16)
    ];
  }

  function rgbaFromHex(hex, alpha) {
    const [r, g, b] = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function adjustColor(hex, amount) {
    let [r, g, b] = hexToRgb(hex);
    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));
    return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
  }

  function isLightColor(hex) {
    const [r, g, b] = hexToRgb(hex);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  }

  function computeThemeCSSVars(primary, bg, text) {
    const bgIsLight = isLightColor(bg);
    const primaryRgb = hexToRgb(primary).join(', ');
    const textRgb = hexToRgb(text).join(', ');

    // 根据背景明暗推算派生色
    const bgSecondary = bgIsLight ? adjustColor(bg, -8) : adjustColor(bg, 12);
    const bgTertiary = bgIsLight ? adjustColor(bg, -16) : adjustColor(bg, 20);
    const borderColor = bgIsLight ? adjustColor(bg, -30) : adjustColor(bg, 35);
    const borderLight = bgIsLight ? adjustColor(bg, -15) : adjustColor(bg, 22);
    const textSecondary = bgIsLight ? adjustColor(text, 80) : adjustColor(text, -50);
    const textMuted = bgIsLight ? adjustColor(text, 140) : adjustColor(text, -90);
    const accentHover = adjustColor(primary, bgIsLight ? -15 : 15);
    const inputBg = bgIsLight ? adjustColor(bg, -12) : adjustColor(bg, 16);
    const inputBorder = bgIsLight ? adjustColor(bg, -35) : adjustColor(bg, 40);
    const toggleBg = bgIsLight ? adjustColor(bg, -40) : adjustColor(bg, 45);
    const scrollbarThumb = bgIsLight ? adjustColor(bg, -60) : adjustColor(bg, 60);
    const kbdBg = bgIsLight ? adjustColor(bg, -12) : adjustColor(bg, 16);
    const kbdBorder = bgIsLight ? adjustColor(bg, -35) : adjustColor(bg, 40);
    const shadowBase = bgIsLight
      ? `rgba(0, 0, 0, ${bgIsLight ? '0.08' : '0.3'})`
      : 'rgba(0, 0, 0, 0.3)';
    const tabHover = bgIsLight ? adjustColor(bg, -18) : adjustColor(bg, 22);
    const itemHover = bgIsLight ? adjustColor(bg, -6) : adjustColor(bg, 10);
    const headerBg = bg;
    const tabActiveBg = bg;
    const tabInactive = bgIsLight ? adjustColor(text, 100) : adjustColor(text, -60);
    const overlayBg = bgIsLight ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.6)';

    return {
      '--theme-primary': primary,
      '--theme-primary-rgb': primaryRgb,
      '--theme-bg': bg,
      '--theme-bg-rgb': hexToRgb(bg).join(', '),
      '--theme-text': text,
      '--theme-text-rgb': textRgb,
      '--panel-bg': bg,
      '--panel-bg-secondary': bgSecondary,
      '--panel-bg-tertiary': bgTertiary,
      '--panel-border': borderColor,
      '--panel-border-light': borderLight,
      '--panel-text-primary': text,
      '--panel-text-secondary': textSecondary,
      '--panel-text-muted': textMuted,
      '--panel-accent': primary,
      '--panel-accent-hover': accentHover,
      '--panel-accent-light': rgbaFromHex(primary, 0.08),
      '--panel-accent-border': rgbaFromHex(primary, 0.3),
      '--panel-danger': '#ea4335',
      '--panel-danger-hover': '#d33426',
      '--panel-success': '#0f9d58',
      '--panel-warning': '#f9ab00',
      '--panel-shadow-sm': `0 1px 3px ${shadowBase}`,
      '--panel-shadow': `0 4px 24px ${shadowBase}`,
      '--panel-shadow-lg': `0 12px 48px ${shadowBase}`,
      '--panel-radius-sm': '6px',
      '--panel-radius': '10px',
      '--panel-radius-lg': '14px',
      '--panel-radius-xl': '20px',
      '--panel-header-bg': headerBg,
      '--panel-tab-active-bg': tabActiveBg,
      '--panel-tab-hover-bg': tabHover,
      '--panel-tab-inactive': tabInactive,
      '--panel-item-hover': itemHover,
      '--panel-item-active': rgbaFromHex(primary, 0.08),
      '--panel-input-bg': inputBg,
      '--panel-input-border': inputBorder,
      '--panel-input-focus-border': primary,
      '--panel-input-focus-shadow': `0 0 0 3px ${rgbaFromHex(primary, 0.15)}`,
      '--panel-scrollbar-thumb': scrollbarThumb,
      '--panel-scrollbar-track': 'transparent',
      '--panel-highlight-bg': '#fff9c4',
      '--panel-highlight-color': text,
      '--panel-badge-bg': primary,
      '--panel-badge-color': '#ffffff',
      '--panel-toggle-bg': toggleBg,
      '--panel-toggle-active': primary,
      '--panel-kbd-bg': kbdBg,
      '--panel-kbd-border': kbdBorder,
      '--panel-overlay-bg': overlayBg
    };
  }


const ALL_THEME_CLASSES = [
    'theme-deep-blue', 'theme-minimal-white', 'theme-classic-black',
    'theme-eye-green', 'theme-warm-orange', 'theme-night-purple',
    'theme-custom', 'theme-follow-system'
];

  const THEME_DEFINITIONS = {
    'follow-system': {
      id: 'follow-system',
      name: '跟随系统',
      icon: '🌓',
      primary: '#0077BE',
      bg: '#ffffff',
      text: '#333333',
      cssClass: 'theme-follow-system',
      isSystem: true
    },
    'deep-blue': {
      id: 'deep-blue',
      name: '深海蓝',
      icon: '🌊',
      primary: '#0077BE',
      bg: '#ffffff',
      text: '#333333',
      cssClass: 'theme-deep-blue',
      isDefault: true
    },
    'minimal-white': {
      id: 'minimal-white',
      name: '极简白',
      icon: '☁️',
      primary: '#666666',
      bg: '#fafafa',
      text: '#1a1a1a',
      cssClass: 'theme-minimal-white'
    },
    'classic-black': {
      id: 'classic-black',
      name: '经典黑',
      icon: '🌙',
      primary: '#bbbbbb',
      bg: '#1e1e1e',
      text: '#e0e0e0',
      cssClass: 'theme-classic-black'
    },
    'eye-green': {
      id: 'eye-green',
      name: '护眼绿',
      icon: '🍃',
      primary: '#52c41a',
      bg: '#f6ffed',
      text: '#333333',
      cssClass: 'theme-eye-green'
    },
    'warm-orange': {
      id: 'warm-orange',
      name: '暖阳橙',
      icon: '☀️',
      primary: '#fa8c16',
      bg: '#fff7e6',
      text: '#333333',
      cssClass: 'theme-warm-orange'
    },
    'night-purple': {
      id: 'night-purple',
      name: '暗夜紫',
      icon: '🌌',
      primary: '#722ed1',
      bg: '#1a1a2e',
      text: '#e0d7f5',
      cssClass: 'theme-night-purple'
    },
    'custom': {
      id: 'custom',
      name: '创建我的主题',
      icon: '➕',
      primary: '#0077BE',
      bg: '#ffffff',
      text: '#333333',
      cssClass: 'theme-custom',
      isCustom: true
    }
  };

const PRESET_THEME_IDS = ['deep-blue', 'minimal-white', 'classic-black', 'eye-green', 'warm-orange', 'night-purple'];
// ==================== 模块: 主题管理 ====================

  // ==================== 主题系统 ====================

  function applyTheme(themeId) {
    // 移除所有主题类
    ALL_THEME_CLASSES.forEach(cls => dom.body.classList.remove(cls));

    if (themeId === 'follow-system') {
      // 跟随系统：检测 prefers-color-scheme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const effectiveTheme = prefersDark ? 'classic-black' : 'minimal-white';
      dom.body.classList.add(THEME_DEFINITIONS[effectiveTheme].cssClass);
    } else if (themeId === 'custom') {
      // 自定义主题：动态注入 CSS 变量
      dom.body.classList.add('theme-custom');
      applyCustomThemeVars();
    } else {
      // 预设主题
      const def = THEME_DEFINITIONS[themeId];
      if (def && def.cssClass) {
        dom.body.classList.add(def.cssClass);
      }
    }

    // 更新主题卡片高亮
    updateThemeCardHighlight(themeId);

    // 同步到 content.js（悬浮按钮主题）
    syncThemeToContent(themeId);

    // 保存到 storage
    state.theme = themeId;
    saveSettings();
  }

  function applyCustomThemeVars() {
    const colors = state.customThemeColors || {
      primary: '#1890ff',
      bg: '#ffffff',
      text: '#333333'
    };
    const vars = computeThemeCSSVars(colors.primary, colors.bg, colors.text);

    Object.entries(vars).forEach(([key, value]) => {
      dom.body.style.setProperty(key, value);
    });
  }

  function syncThemeToContent(themeId) {
    // 获取当前主题的颜色信息
    let themeInfo;
    if (themeId === 'follow-system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      themeInfo = THEME_DEFINITIONS[prefersDark ? 'classic-black' : 'minimal-white'];
    } else {
      themeInfo = THEME_DEFINITIONS[themeId];
    }

    if (!themeInfo) return;

    // 发送主题信息到 content.js
    safeSendMessage({
      action: 'settings-changed',
      settings: {
        theme: themeId,
        themeColors: {
          primary: themeInfo.primary,
          bg: themeInfo.bg,
          text: themeInfo.text
        },
        enableFloatButton: state.enableFloatButton,
        preferredLanguage: state.preferredLanguage
      }
    });

    // 同时通过 postMessage 发送（面板在 iframe 内）
    try {
      window.parent.postMessage({
        action: 'theme-changed',
        theme: themeId,
        themeColors: {
          primary: themeInfo.primary,
          bg: themeInfo.bg,
          text: themeInfo.text
        }
      }, '*');
    } catch (e) {}
  }

  function getEffectiveTheme(themeId) {
    if (themeId === 'follow-system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return THEME_DEFINITIONS[prefersDark ? 'classic-black' : 'minimal-white'];
    }
    return THEME_DEFINITIONS[themeId];
  }

  function applyFontSize(size) {
    dom.body.classList.remove('font-small', 'font-medium', 'font-large');
    dom.body.classList.add('font-' + size);
    state.fontSize = size;
    saveSettings();
  }

function saveSettings() {
    state.settings = {
      theme: state.theme,
      customThemeColors: state.customThemeColors,
      fontSize: state.fontSize,
      enableFloatButton: state.enableFloatButton,
      maxHistoryItems: state.settings.maxHistoryItems || 50,
      showAbsoluteTime: state.showAbsoluteTime,
      preferredLanguage: state.preferredLanguage
    };
    storageSet('settings', state.settings);
  }

  // ==================== 主题卡片渲染 ====================

  function renderThemeCards() {
    if (!dom.themeCardGrid) return;
    dom.themeCardGrid.innerHTML = '';

    // 卡片顺序：跟随系统 + 6 预设 + 自定义
    const cardOrder = ['follow-system', ...PRESET_THEME_IDS, 'custom'];

    cardOrder.forEach(themeId => {
      const def = THEME_DEFINITIONS[themeId];
      const card = document.createElement('div');
      card.className = 'theme-card';
      card.setAttribute('data-theme', themeId);

      // 自定义主题特殊样式
      if (def.isCustom) {
        card.classList.add('theme-card-custom');
      } else if (def.isSystem) {
        card.classList.add('theme-card-system');
      }

      // 是否当前激活
      if (state.theme === themeId) {
        card.classList.add('active');
      }

      // 图标
      if (def.icon) {
        const iconEl = document.createElement('span');
        iconEl.className = 'theme-card-icon';
        iconEl.textContent = def.icon;
        card.appendChild(iconEl);
      }

      // 名称
      const nameEl = document.createElement('span');
      nameEl.className = 'theme-card-name';
      const themeNameKeys = {
        'follow-system': 'themeNameFollowSystem',
        'deep-blue': 'themeNameDeepBlue',
        'minimal-white': 'themeNameMinimalWhite',
        'classic-black': 'themeNameClassicBlack',
        'eye-green': 'themeNameEyeGreen',
        'warm-orange': 'themeNameWarmOrange',
        'night-purple': 'themeNameNightPurple',
        'custom': 'themeNameCustom'
      };
      let displayName = t(themeNameKeys[themeId] || themeId);
      if (def.isCustom && state.customThemeColors) {
        displayName = t('themeNameMyCustom');
      }
      nameEl.textContent = displayName;
      card.appendChild(nameEl);

      // 色块预览
      if (!def.isSystem) {
        const previewEl = document.createElement('div');
        previewEl.className = 'theme-card-preview';
        const previewPrimary = document.createElement('span');
        previewPrimary.className = 'preview-primary';
        previewPrimary.style.setProperty('--card-preview-primary', def.primary);
        previewPrimary.style.backgroundColor = def.primary;
        const previewBg = document.createElement('span');
        previewBg.className = 'preview-bg';
        previewBg.style.setProperty('--card-preview-bg', def.bg);
        previewBg.style.backgroundColor = def.bg;
        previewEl.appendChild(previewPrimary);
        previewEl.appendChild(previewBg);
        card.appendChild(previewEl);
      } else {
        // 跟随系统：显示双色预览
        const previewEl = document.createElement('div');
        previewEl.className = 'theme-card-preview';
        const previewLight = document.createElement('span');
        previewLight.className = 'preview-primary';
        previewLight.style.backgroundColor = '#fafafa';
        const previewDark = document.createElement('span');
        previewDark.className = 'preview-bg';
        previewDark.style.backgroundColor = '#1e1e1e';
        previewDark.style.flex = '1';
        previewEl.appendChild(previewLight);
        previewEl.appendChild(previewDark);
        card.appendChild(previewEl);
      }

      // 激活标记
      const badgeEl = document.createElement('span');
      badgeEl.className = 'card-active-badge';
      badgeEl.textContent = t('themeBadgeActive');
      card.appendChild(badgeEl);

      // 点击事件
      card.addEventListener('click', () => {
        if (def.isCustom) {
          // 打开取色器
          openColorPicker();
        } else {
          // 预设主题 / 跟随系统
          applyTheme(themeId);
          renderThemeCards();
        }
      });

      dom.themeCardGrid.appendChild(card);
    });
  }

  function updateThemeCardHighlight(activeThemeId) {
    if (!dom.themeCardGrid) return;
    const cards = dom.themeCardGrid.querySelectorAll('.theme-card');
    cards.forEach(card => {
      const themeId = card.getAttribute('data-theme');
      if (themeId === activeThemeId) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  // ==================== 自定义颜色取色器 ====================

  function openColorPicker() {
    if (!dom.colorPickerModal) return;

    // 加载当前自定义色值或默认值
    const colors = state.customThemeColors || {
      primary: '#1890ff',
      bg: '#ffffff',
      text: '#333333'
    };

    dom.customColorPrimary.value = colors.primary;
    dom.customColorBg.value = colors.bg;
    dom.customColorText.value = colors.text;
    dom.customColorPrimaryVal.textContent = colors.primary;
    dom.customColorBgVal.textContent = colors.bg;
    dom.customColorTextVal.textContent = colors.text;

    // 更新预览
    updateColorPreview(colors.primary, colors.bg, colors.text);

    // 显示模态框
    dom.colorPickerModal.style.display = 'flex';
  }

  function closeColorPicker() {
    if (dom.colorPickerModal) {
      dom.colorPickerModal.style.display = 'none';
    }
  }

  function updateColorPreview(primary, bg, text) {
    if (dom.colorPreviewArea) {
      dom.colorPreviewArea.style.backgroundColor = bg;
      dom.colorPreviewArea.style.color = text;
      dom.colorPreviewArea.style.borderColor = primary;
    }
  }

  function saveCustomTheme() {
    const primary = dom.customColorPrimary.value;
    const bg = dom.customColorBg.value;
    const text = dom.customColorText.value;

    // 保存自定义色值
    state.customThemeColors = { primary, bg, text };

    // 更新 THEME_DEFINITIONS
    THEME_DEFINITIONS['custom'].primary = primary;
    THEME_DEFINITIONS['custom'].bg = bg;
    THEME_DEFINITIONS['custom'].text = text;
    THEME_DEFINITIONS['custom'].name = t('themeNameMyCustom');

    // 保存到 storage
    saveSettings();

    // 应用自定义主题
    applyTheme('custom');

    // 重新渲染卡片
    renderThemeCards();

    // 关闭取色器
    closeColorPicker();

    showToast(t('themeCustomSaved'));
  }

  // ==================== 跟随系统：监听系统主题变化 ====================

  function setupSystemThemeListener() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      if (state.theme === 'follow-system') {
        // 重新应用跟随系统主题
        applyTheme('follow-system');
      }
    };

    // 使用现代 API
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // 兼容旧版
      mediaQuery.addListener(handleChange);
    }
  }
