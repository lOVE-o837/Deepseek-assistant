/**
 * DeepSeek Assistant - Content Script (module orchestrator)
 * 仅负责引入所有模块别名并启动核心
 */

(function () {
  'use strict';

  // 别名（按需引入，但 core 已启动，这里仅保留为兼容其他模块可能直接引用）
  // 实际上 core 启动后一切就绪，此文件可以留空或仅做调试。
  console.log('[DeepSeek-Assistant] All modules loaded.');

})();