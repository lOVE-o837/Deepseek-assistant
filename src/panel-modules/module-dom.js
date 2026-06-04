// module-dom.js
 // ==================== 模块: DOM 工具函数-引用缓存-6====================

  //  Toast 提示-显示短暂提示消息，自动消失 
  function showToast(message) {
    // 确保 toast 容器存在
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 2700);
  }

 //转义 HTML 特殊字符，防止 XSS
       function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

 // 高亮文本中的匹配关键词 
  function highlightText(text, query) {
    if (!text || !query) return escapeHTML(text);
    const escapedText = escapeHTML(text);
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return escapedText.replace(regex, '<mark>$1</mark>');
  } 

// 格式化时间戳为相对时间或绝对时间
function formatTime(timestamp, showAbsolute = false) {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  if (showAbsolute) return d.toLocaleString('zh-CN');
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return t('timeJustNow');
  if (diffMin < 60) return diffMin + t('timeMinAgo');
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return diffHour + t('timeHourAgo');
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return diffDay + t('timeDayAgo');
  return d.toLocaleDateString(state.preferredLanguage === 'en' ? 'en-US' : 'zh-CN');
  }

 // 防抖函数，延迟执行直到停止调用
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // 聚焦历史搜索输入框
   function focusHistorySearchInput() {
    if (dom.historySearchInput && dom.historySearchInput.offsetParent !== null) {
      dom.historySearchInput.focus();
    }
  }

  