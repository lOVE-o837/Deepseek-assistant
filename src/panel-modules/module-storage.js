// module-storage.js
// ====================  状态管理 ====================
// 负责 content-ready 握手、chrome.storage.local 的安全读写
// content-ready 握手标记，标记页面脚本是否已就绪
let contentReady = false;
 // content-ready 握手超时计时器
  let contentReadyFallbackTimer = null;

// ==================== 模块: 存储与消息 ====================

    // ============= 安全通信辅助函数 ============


  // 启动 content-ready 超时兜底定时器：3秒后若仍未收到就绪信号，强制标记为就绪并尝试加载历史数据
  function startContentReadyFallback() {
    if (contentReadyFallbackTimer) return;
    contentReadyFallbackTimer = setTimeout(() => {
      contentReady = true;
      contentReadyFallbackTimer = null;
      if (state.currentTab === 'history-search') {
        loadHistoryData();
      }
    }, 3000);
  }

// 安全发送 Chrome 扩展消息，自动捕获上下文失效异常，避免插件崩溃
  function safeSendMessage(message, callback) {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
      try {
        if (callback) {
          const p = chrome.runtime.sendMessage(message, callback);
          if (p && typeof p.catch === 'function') {
            p.catch(() => {
              console.warn('[DeepSeek助手] 插件上下文已失效（Extension context invalidated），请刷新页面');
              callback(null);
            });
          }
        } else {
          return chrome.runtime.sendMessage(message).catch(() => {
            console.warn('[DeepSeek助手] 插件上下文已失效（Extension context invalidated），请刷新页面');
            return null;
          });
        }
      } catch (e) {
        if (callback) {
          callback(null);
        }
        return Promise.reject(e);
      }
    } else {
      if (callback) {
        callback(null);
      }
      return Promise.resolve(null);
    }
  }

    // ==================== Storage 操作 ====================

// 通过 background.js 安全写入 chrome.storage.local
  function storageSet(key, value) {
    return new Promise((resolve) => {
      safeSendMessage({ action: 'storage-set', key, value }, (res) => {
        resolve(res && res.success);
      });
    });
  }

// 通过 background.js 安全读取 chrome.storage.local  
  function storageGet(key) {
    return new Promise((resolve) => {
      safeSendMessage({ action: 'storage-get', key }, (res) => {
        resolve(res && res.data !== undefined ? res.data : null);
      });
    });
  }

// 通过 background.js 安全删除 chrome.storage.local 中的指定键  
  function storageRemove(key) {
    return new Promise((resolve) => {
      safeSendMessage({ action: 'storage-remove', key }, (res) => {
        resolve(res && res.success);
      });
    });
  }

