// content-float-btn.js — 悬浮按钮 + 长按菜单 + 尺寸切换
// 拆分自原 content.js 的 injectFloatButton、showFloatMenu 及相关函数
/**
 * DeepSeek Assistant - content-float-btn.js
 * 悬浮按钮注入、拖拽、长按菜单、尺寸切换、书签状态
 * 依赖：content-utils.js (window.__DS__)
 */
var lang = (typeof DS !== 'undefined' && DS.settings && DS.settings.preferredLanguage) || 'zh';

(function() {
  const DS = window.__DS__ = window.__DS__ || {};

  DS.injectFloatButton = function injectFloatButton(FLOAT_BTN_ID) {
    if (document.getElementById(FLOAT_BTN_ID)) return;

    const floatBtn = document.createElement('div');
    floatBtn.id = FLOAT_BTN_ID;
    floatBtn.innerHTML = '\u2B50';
    floatBtn.title = lang === 'en' ? 'Bookmark / Drag to move (Alt+K to open panel)' : '收藏当前对话 / 拖拽移动 (Alt+K 打开面板)';
    floatBtn.style.cssText = [
      'position: fixed;',
      'bottom: 120px;',
      'right: 24px;',
      'width: 44px;',
      'height: 44px;',
      'border-radius: 50%;',
      'background: var(--ds-primary, #1890ff);',
      'color: #fff;',
      'font-size: 20px;',
      'display: flex;',
      'align-items: center;',
      'justify-content: center;',
      'cursor: pointer;',
      'z-index: 9998;',
      'box-shadow: 0 4px 12px rgba(0,0,0,0.15);',
      'transition: all 0.3s ease;',
      'border: 2px solid transparent;',
      'user-select: none;'
    ].join('');

    // 挂载到全局，供其他模块使用
    DS.floatBtn = floatBtn;

    // 拖拽功能 + 防误触
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let btnStartRight = 0;
    let btnStartBottom = 0;
    let hasMoved = false;
    let longPressTimer = null;
    const LONG_PRESS_DURATION = 600;

    floatBtn.addEventListener('mousedown', (e) => {
      isDragging = true;
      hasMoved = false;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      btnStartRight = parseInt(floatBtn.style.right) || 24;
      btnStartBottom = parseInt(floatBtn.style.bottom) || 120;
      floatBtn.style.transition = 'none';
      longPressTimer = setTimeout(() => {
        if (!hasMoved) { isDragging = false; longPressFired = true; showFloatMenu(e.clientX, e.clientY); }
      }, LONG_PRESS_DURATION);
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = dragStartX - e.clientX;
      const dy = dragStartY - e.clientY;
      floatBtn.style.right = (btnStartRight + dx) + 'px';
      floatBtn.style.bottom = (btnStartBottom + dy) + 'px';
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        hasMoved = true;
        if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
      }
    });

    let longPressFired = false;
    document.addEventListener('mouseup', () => {
      if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
      if (isDragging) {
        floatBtn.style.transition = 'all 0.3s ease';
        isDragging = false;
      }
    });

    function showFloatMenu(x, y) {
      const old = document.getElementById('ds-float-menu');
      if (old) old.remove();
      const menu = document.createElement('div');
      menu.id = 'ds-float-menu';
      const getCurrentSize = async () => {
        const result = await chrome.storage.local.get(['panel_size']);
        return result['panel_size'] || 'medium';
      };

      const lang = (DS.settings && DS.settings.preferredLanguage) || 'zh';
      const sizes = [
        { id: 'small', label: lang === 'en' ? 'Small (340×480)' : '小 (340×480)', width: 340, height: 480 },
        { id: 'medium', label: lang === 'en' ? 'Medium (420×600)' : '中 (420×600)', width: 420, height: 600 },
        { id: 'large', label: lang === 'en' ? 'Large (560×720)' : '大 (560×720)', width: 560, height: 720 },
        { id: 'original', label: lang === 'en' ? 'Original (432×Auto)' : '原 (432×自适应)', width: 432, height: null }
      ];

      const items = [
        { icon: '⌂', label: lang === 'en' ? 'Open Assistant' : '打开助手面板', action: () => { DS.showPanel(DS.panelIframeObj.ref, floatBtn, DS.sendContentReady, 'ds-assistant-overlay'); menu.remove(); } },
        { icon: '🔗', label: lang === 'en' ? 'Copy Link' : '复制对话链接', action: () => { navigator.clipboard.writeText(window.location.href).then(() => DS.showToast(lang === 'en' ? '✅ Link copied' : '✅ 链接已复制')); menu.remove(); } },
        { icon: '📐', label: lang === 'en' ? 'Size ▸' : '切换尺寸 ▸', action: null, isParent: true }
      ];
      const renderMenu = (showSizes = false) => {
        const currentSize = window.__ds_panel_size || 'medium';
        let html = '';
        items.forEach((item, i) => {
          if (item.isParent) {
            html += `<button class="ds-float-menu-item" data-idx="${i}" style="display:block;width:100%;padding:8px 14px;text-align:left;background:none;border:none;color:var(--panel-text-primary,#333);cursor:pointer;font-size:13px;">${item.icon} ${lang === 'en' ? (showSizes ? 'Size ▾' : 'Size ▸') : (showSizes ? '切换尺寸 ▾' : '切换尺寸 ▸')}</button>`;
            if (showSizes) {
              sizes.forEach(s => {
                const selected = s.id === currentSize;
                html += `<button class="ds-float-menu-item ds-size-option" data-size="${s.id}" data-width="${s.width}" style="display:block;width:100%;padding:6px 14px 6px 28px;text-align:left;background:none;border:none;color:${selected ? 'var(--primary-color,#4f46e5)' : 'var(--panel-text-secondary,#666)'};cursor:pointer;font-size:12px;font-weight:${selected ? '600' : '400'};">${selected ? '●' : '○'} ${s.label.replace(/[●○]\s*/, '')}</button>`;
              });
            }
          } else {
            html += `<button class="ds-float-menu-item" data-idx="${i}" style="display:block;width:100%;padding:8px 14px;text-align:left;background:none;border:none;color:var(--panel-text-primary,#333);cursor:pointer;font-size:13px;">${item.icon} ${item.label}</button>`;
          }
        });
        menu.innerHTML = html;
      };
      const fixMenuPosition = () => {
        const mw = menu.offsetWidth || 210;
        const mh = menu.offsetHeight || 80;
        let newLeft = parseInt(menu.style.left) || left;
        let newTop = parseInt(menu.style.top) || top;
        if (newLeft + mw > window.innerWidth - 10) newLeft = window.innerWidth - mw - 10;
        if (newLeft < 5) newLeft = 5;
        if (newTop + mh > window.innerHeight - 10) newTop = window.innerHeight - mh - 10;
        if (newTop < 5) newTop = 5;
        menu.style.left = newLeft + 'px';
        menu.style.top = newTop + 'px';
      };
      getCurrentSize().then(size => {
        window.__ds_panel_size = size;
        renderMenu(false);
        setTimeout(fixMenuPosition, 20);
      });
      menu.style.cssText = 'position:fixed;z-index:99999;background:var(--panel-bg,#fff);border:1px solid var(--panel-border,#e0e0e0);border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,0.15);padding:4px 0;min-width:140px;font-size:13px;';
      let left = x - 10, top = y - 10;
      const menuWidth = 210;
      if (left + menuWidth > window.innerWidth - 10) left = x - menuWidth + 10;
      if (left < 5) left = 5;
      if (top + 80 > window.innerHeight) top = window.innerHeight - 90;
      menu.style.left = left + 'px';
      menu.style.top = top + 'px';
      document.body.appendChild(menu);

      let sizesExpanded = false;
      menu.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        e.stopPropagation();
        if (btn.classList.contains('ds-size-option')) {
          const sizeId = btn.getAttribute('data-size');
          const width = parseInt(btn.getAttribute('data-width'));
          window.__ds_panel_size = sizeId;
          chrome.storage.local.set({ panel_size: sizeId });
          if (DS.panelIframeObj && DS.panelIframeObj.ref) {
            DS.panelIframeObj.ref.style.width = width + 'px';
            const sizeObj = sizes.find(s => s.id === sizeId);
            if (sizeObj && sizeObj.height) DS.panelIframeObj.ref.style.height = sizeObj.height + 'px';
            else if (sizeObj && sizeObj.height === null) DS.panelIframeObj.ref.style.height = '88vh';
          }
          renderMenu(true);
          return;
        }
        const idx = btn.getAttribute('data-idx');
        if (idx !== null && items[parseInt(idx)]) {
          const item = items[parseInt(idx)];
          if (item.isParent) {
            sizesExpanded = !sizesExpanded;
            renderMenu(sizesExpanded);
            setTimeout(fixMenuPosition, 20);
            return;
          }
          if (item.action) item.action();
        }
      });
      menu.addEventListener('mouseover', (e) => {
        const btn = e.target.closest('button');
        if (btn) btn.style.background = 'var(--primary-color-light,rgba(79,70,229,0.08))';
      });
      menu.addEventListener('mouseout', (e) => {
        const btn = e.target.closest('button');
        if (btn) btn.style.background = 'none';
      });
      menu.addEventListener('mousedown', (e) => e.stopPropagation());
      const closeMenu = (e) => { if (!menu.contains(e.target)) { menu.remove(); document.removeEventListener('mousedown', closeMenu); } };
      setTimeout(() => document.addEventListener('mousedown', closeMenu), 300);
    }

    floatBtn.addEventListener('click', async (e) => {
      if (longPressFired) { longPressFired = false; return; }
      if (hasMoved) return;
      if (floatBtn.classList.contains('panel-minimized')) {
        DS.showPanel(DS.panelIframeObj.ref, floatBtn, DS.sendContentReady, 'ds-assistant-overlay');
        return;
      }
      DS.showConfirmDialog(
        lang === 'en' ? '⭐ Bookmark Conversation' : '⭐ 收藏当前对话',
        lang === 'en' ? 'Bookmark this conversation?' : '是否收藏当前对话？',
        () => { DS.bookmarkCurrentPage().then(() => DS.markFloatBtnAsBookmarked()); },
        () => {}
      );
    });

    floatBtn.addEventListener('mouseenter', () => {
      floatBtn.style.transform = 'scale(1.1)';
      floatBtn.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
    });
    floatBtn.addEventListener('mouseleave', () => {
      floatBtn.style.transform = 'scale(1)';
      floatBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    });

    document.body.appendChild(floatBtn);

    if (!document.getElementById('ds-float-btn-bookmarked-style')) {
      const fbStyle = document.createElement('style');
      fbStyle.id = 'ds-float-btn-bookmarked-style';
      fbStyle.textContent = '#ds-assistant-float-btn.bookmarked { background: #f5a623 !important; color: #fff !important; border-color: #e0960e !important; box-shadow: 0 4px 12px rgba(245,166,35,0.4) !important; } #ds-assistant-float-btn.panel-minimized::after { content: ""; position: absolute; top: -3px; right: -3px; width: 8px; height: 8px; background: #ea4335; border-radius: 50%; border: 1.5px solid #fff; }';
      document.head.appendChild(fbStyle);
    }

    DS.updateFloatButtonVisibility();
  };

  DS.updateFloatButtonVisibility = function updateFloatButtonVisibility() {
    const fb = DS.floatBtn;
    if (!fb) return;
    fb.style.display = (DS.settings && DS.settings.enableFloatButton) ? 'flex' : 'none';
  };

  DS.updateFloatBtnBookmarkState = async function updateFloatBtnBookmarkState() {
    const fb = DS.floatBtn;
    if (!fb) return;
    try {
      const stored = await chrome.storage.local.get(['bookmarks']);
      const bookmarks = stored['bookmarks'] || [];
      const currentUrl = window.location.href;
      const isBookmarked = bookmarks.some(function (b) {
        return b.url && b.url === currentUrl;
      });
      if (isBookmarked) {
        fb.classList.add('bookmarked');
        fb.title = '已收藏 / 拖拽移动 (Alt+K 打开面板)';
      } else {
        fb.classList.remove('bookmarked');
        fb.title = '收藏当前对话 / 拖拽移动 (Alt+K 打开面板)';
      }
    } catch (e) {}
  };

  DS.markFloatBtnAsBookmarked = function markFloatBtnAsBookmarked() {
    const fb = DS.floatBtn;
    if (!fb) return;
    fb.classList.add('bookmarked');
    fb.title = lang === 'en' ? 'Bookmarked / Drag to move (Alt+K to open panel)' : '已收藏 / 拖拽移动 (Alt+K 打开面板)';
  };

  DS.checkUrlAndUpdateFloatBtn = function checkUrlAndUpdateFloatBtn() {
    const currentUrl = window.location.href;
    if (currentUrl === _lastCheckedUrl) return;
    _lastCheckedUrl = currentUrl;
    const fb = DS.floatBtn;
    if (fb) {
      fb.classList.remove('bookmarked');
      fb.title = lang === 'en' ? 'Bookmark / Drag to move (Alt+K to open panel)' : '收藏当前对话 / 拖拽移动 (Alt+K 打开面板)';
    }
    DS.updateFloatBtnBookmarkState();
  };

  // ==================== SPA 监听 ====================
  let _lastCheckedUrl = window.location.href;
  setInterval(DS.checkUrlAndUpdateFloatBtn, 800);
  window.addEventListener('popstate', DS.checkUrlAndUpdateFloatBtn);
  const origPush = history.pushState, origReplace = history.replaceState;
  history.pushState = function() { origPush.apply(this, arguments); DS.checkUrlAndUpdateFloatBtn(); };
  history.replaceState = function() { origReplace.apply(this, arguments); DS.checkUrlAndUpdateFloatBtn(); };
})();