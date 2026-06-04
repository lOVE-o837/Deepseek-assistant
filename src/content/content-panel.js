// content-panel.js — 面板 iframe 通信 + 拖拽 + 位置记忆
// 拆分自原 content.js 的 injectPanelIframe、togglePanel、drag 相关函数
/**
 * DeepSeek Assistant - content-panel.js
 * 面板 iframe 注入、显示/隐藏、拖拽、位置记忆
 * 依赖：content-utils.js (window.__DS__)，content-core.js 中的 sendContentReady
 */
(function() {
  const DS = window.__DS__ = window.__DS__ || {};

  DS.injectPanelIframe = function injectPanelIframe(PANEL_ID, PANEL_OVERLAY_ID, panelIframeObj, hidePanelFn) {
    const existingIframe = document.getElementById(PANEL_ID);
    if (existingIframe) {
      existingIframe.remove();
    }
    const existingOverlay = document.getElementById(PANEL_OVERLAY_ID);
    if (existingOverlay) {
      existingOverlay.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.id = PANEL_ID;
    iframe.src = chrome.runtime.getURL('panel.html');
    iframe.style.cssText = [
      'position: fixed;',
      'top: 50%;',
      'left: 50%;',
      'transform: translate(-50%, -50%) scale(0.9);',
      'z-index: 2147483647;',
      'width: 480px;',
      'height: 88vh;',
      'min-height: 600px;',
      'max-width: 92vw;',
      'max-height: 88vh;',
      'border: none;',
      'border-radius: 14px;',
      'box-shadow: 0 12px 48px rgba(0,0,0,0.25);'
    ].join('');
    iframe.classList.remove('visible');
    panelIframeObj.ref = iframe;

    const overlay = document.createElement('div');
    overlay.id = PANEL_OVERLAY_ID;
    overlay.style.cssText = [
      'position: fixed;',
      'inset: 0;',
      'z-index: 2147483645;',
      'background: rgba(0,0,0,0.4);'
    ].join('');
    overlay.classList.remove('visible');
    overlay.addEventListener('click', () => hidePanelFn());
    document.body.appendChild(overlay);

    document.body.appendChild(iframe);
  };

  DS.togglePanel = function togglePanel(panelIframe, hidePanelFn, showPanelFn) {
    if (!panelIframe) return;
    const visible = panelIframe.classList.contains('visible');
    if (visible) {
      hidePanelFn();
    } else {
      showPanelFn();
    }
  };

  DS.showPanel = async function showPanel(panelIframe, floatBtn, sendContentReadyFn, PANEL_OVERLAY_ID) {
    if (!panelIframe) return;

    try {
      const result = await chrome.storage.local.get(['panel_positions']);
      const positions = result['panel_positions'] || {};
      const currentUrl = window.location.href;
      const saved = positions[currentUrl];
      if (saved && saved.left !== undefined && saved.top !== undefined) {
        let clampedLeft = saved.left;
        let clampedTop = saved.top;
        const pw = panelIframe.offsetWidth || 420;
        const ph = panelIframe.offsetHeight || 600;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        if (clampedLeft + pw > vw - 50) clampedLeft = Math.max(50, vw - pw - 50);
        if (clampedLeft < 0) clampedLeft = 50;
        if (clampedTop + ph > vh - 50) clampedTop = Math.max(50, vh - ph - 50);
        if (clampedTop < 0) clampedTop = 50;
        panelIframe.style.left = clampedLeft + 'px';
        panelIframe.style.top = clampedTop + 'px';
        const sizeResult = await chrome.storage.local.get(['panel_size']);
        const sizeId = sizeResult['panel_size'];
        const sizeMap = { small: { w: 340, h: 480 }, medium: { w: 420, h: 600 }, large: { w: 560, h: 720 }, original: { w: 432, h: null } };
        if (sizeMap[sizeId]) {
          panelIframe.style.width = sizeMap[sizeId].w + 'px';
          if (sizeMap[sizeId].h) panelIframe.style.height = sizeMap[sizeId].h + 'px';
          else panelIframe.style.height = '88vh';
        }
        panelIframe.style.transform = 'scale(0.9)';
      }
    } catch (e) {}

    panelIframe.classList.add('visible');
    const overlay = document.getElementById(PANEL_OVERLAY_ID);
    if (overlay) overlay.classList.add('visible');
    if (floatBtn) floatBtn.classList.remove('panel-minimized');
    setTimeout(() => sendContentReadyFn(), 50);
  };

  DS.hidePanel = function hidePanel(panelIframe, resetDragTransformFn, PANEL_OVERLAY_ID) {
    if (!panelIframe) return;
    panelIframe.classList.remove('visible');
    const overlay = document.getElementById(PANEL_OVERLAY_ID);
    if (overlay) overlay.classList.remove('visible');
    resetDragTransformFn();
  };

  DS.resetDragTransform = function resetDragTransform(panelIframe, dragStateRef) {
    if (dragStateRef.ref) {
      document.removeEventListener('mousemove', dragStateRef.ref.onMouseMove);
      document.removeEventListener('mouseup', dragStateRef.ref.onMouseUp);
      dragStateRef.ref = null;
    }
    if (panelIframe) {
      panelIframe.style.left = '';
      panelIframe.style.top = '';
      panelIframe.style.transform = 'translate(-50%, -50%) scale(0.9)';
    }
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  DS.startDrag = function startDrag(panelIframe, offsetX, offsetY, dragStateRef, savePanelPositionFn) {
    if (!panelIframe) return;

    const rect = panelIframe.getBoundingClientRect();
    panelIframe.style.left = rect.left + 'px';
    panelIframe.style.top = rect.top + 'px';
    panelIframe.style.transform = 'scale(0.9)';

    const onMouseMove = (e) => {
      if (!dragStateRef.ref) return;
      const newLeft = e.clientX - offsetX;
      const newTop = e.clientY - offsetY;
      panelIframe.style.left = newLeft + 'px';
      panelIframe.style.top = newTop + 'px';
      if (panelIframe && panelIframe.contentWindow) {
        panelIframe.contentWindow.postMessage({
          action: 'drag-move',
          left: newLeft,
          top: newTop
        }, '*');
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      if (dragStateRef.ref && panelIframe && panelIframe.contentWindow) {
        const finalLeft = parseFloat(panelIframe.style.left) || 0;
        const finalTop = parseFloat(panelIframe.style.top) || 0;
        panelIframe.contentWindow.postMessage({
          action: 'drag-end',
          left: finalLeft,
          top: finalTop
        }, '*');
        savePanelPositionFn(finalLeft, finalTop);
      }
      dragStateRef.ref = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    if (dragStateRef.ref) {
      document.removeEventListener('mousemove', dragStateRef.ref.onMouseMove);
      document.removeEventListener('mouseup', dragStateRef.ref.onMouseUp);
    }

    dragStateRef.ref = { offsetX, offsetY, onMouseMove, onMouseUp };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  };

  DS.savePanelPosition = async function savePanelPosition(left, top) {
    try {
      const result = await chrome.storage.local.get(['panel_positions']);
      const positions = result['panel_positions'] || {};
      positions[window.location.href] = { left, top };
      await chrome.storage.local.set({ panel_positions: positions });
    } catch (e) {}
  };

})();