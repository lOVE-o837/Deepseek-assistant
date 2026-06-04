# CONTRIBUTING

## 贡献指南

感谢你对 DeepSeek 助手的关注！欢迎提交 Bug 报告、功能建议或代码贡献。

### 报告 Bug

1. 前往 [GitHub Issues](https://github.com/{{你的用户名}}/Deepseek-assistant/issues)，搜索是否已有相同问题的报告。
2. 如无重复，点击「New Issue」选择「Bug Report」模板。
3. 填写以下信息：
   - **浏览器及版本**（如 Edge 126.0）
   - **扩展版本**（在面板「设置」→「关于」中查看）
   - **问题描述**：具体现象、触发条件
   - **复现步骤**：从打开 DeepSeek 开始，逐步说明如何触发 Bug
   - **预期行为**：你期望的正常表现
4. 如有控制台错误信息，请一并附上（F12 → Console → 红色报错截图或文本）。

### 功能建议

1. 在 Issues 中选择「Feature Request」模板。
2. 描述使用场景：你在什么情况下需要这个功能。
3. 描述期望效果：你希望这个功能如何工作。
4. 可选的实现思路：如果你有技术方案的初步想法，欢迎补充。

### Pull Request 流程

1. **Fork 本仓库**，从 `main` 分支创建你的特性分支（如 `feat/batch-operations`）。
2. **代码规范**：
   - 使用原生 JavaScript（ES6+），不引入外部框架或库。
   - 保持与现有模块化架构一致：面板逻辑放 `panel-modules/`，页面逻辑放 `content/`。
   - 通过 `window.__DS__` 命名空间挂载共享函数。
   - 新增 UI 文本需同时添加中英文翻译键到 `module-i18n.js`。
   - 缩进使用 2 空格，函数名使用驼峰命名。
3. **提交信息格式**：`feat: 添加批量删除功能` / `fix: 修复悬浮按钮状态不更新` / `docs: 更新 README`。
4. **测试**：在 Edge 或 Chrome 开发者模式下加载扩展，手动验证功能正常，确保不影响现有功能。
5. **提交 PR**：描述你的修改内容和测试情况，关联相关 Issue（如有）。
6. 项目维护者将在 3 个工作日内审核。

### 开发环境搭建

1. 克隆仓库：`git clone https://github.com/{{你的用户名}}/Deepseek-assistant.git`
2. 打开 `edge://extensions`，开启开发者模式。
3. 点击「加载解压缩的扩展」，选择项目根目录。
4. 修改代码后，点击扩展卡片上的「刷新」按钮即可生效。
5. 打开 `https://chat.deepseek.com/` 验证修改效果。
