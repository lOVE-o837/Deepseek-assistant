# DeepSeek Assistant v2.2.0 — What's New / 更新与使用指南

> **Release information only / 仅发布说明。** This page documents the v2.2.0 browser-extension update. Chrome Web Store and Microsoft Edge Add-ons availability is determined by each store's review and rollout status. **No extension package or private source code is distributed here.**
>
> 本页面是 **v2.2.0 更新说明与使用指南**，不是扩展安装包下载页。Chrome / Edge 商店的实际上架时间以各商店审核和发布状态为准；此页面不附带安装 ZIP 或私有源码。

## 中文说明

### ✨ 提示词工作台：保存常用提示词，下次直接使用

现在可以在独立工作台中创建、编辑、搜索和分类提示词，支持置顶、批量管理和文件夹整理。长提示词可在独立 Markdown 预览中检查格式，再复制或插入使用。

**如何使用：** 打开 DeepSeek 助手面板 → **工作台**。在工作台中创建提示词和文件夹，按分类或文件夹查找；需要批量整理时进入选择模式。

**快捷插入：** 在 DeepSeek 输入框中调出提示词选择器，可以选择插入到开头、当前位置或末尾，或者明确覆盖。插件会检查已有草稿与光标状态；不满足安全条件时可使用复制原文作为回退。**快捷插入不会自动发送消息。**

### 📂 收藏整理：按文件夹集中导出

原有对话、消息以及代码、表格等格式块收藏功能继续保留。现在可按文件夹集中导出已保存内容，省去逐条选择的操作。

**入口：** 打开 **收藏夹 → 操作 → 展开「导出」旁的箭头 → 选择文件夹导出**。在适用的导出流程中可选择按文件夹分组。

### 📝 知识笔记：从收藏到 Markdown / Obsidian

可将收藏的对话与消息整理为 Markdown 知识笔记，复制到其他笔记软件，或使用 Obsidian 笔记创建入口。外部笔记应用是否真正写入成功，以该应用的结果为准。

### 🛡️ 完整备份和安全恢复

设置页提供完整数据备份与恢复入口，覆盖受支持的收藏资产、提示词及相关设置。恢复前展示预检、差异和冲突信息，优先保留已有本地内容，**不会在同 ID 冲突时静默覆盖**。遇到结果不明确的写入，不会自动重复执行。

提示词还支持 JSON 导入导出，以及 Markdown / TXT 文本导入；可继续使用适用的旧版数据格式。

**建议：** 大规模整理或更换设备前，先导出一份完整备份并妥善保管。

### 🎨 面板、主题和首次提示

面板导航、设置页、主题预览及确认弹窗进一步优化。v2.2.0 首次更新说明优先显示，随后按原规则显示格式块跳转提示；另外提供一次性快捷键提示横幅。首次界面语言在没有手动选择时跟随浏览器界面语言。

### ⌨️ 三个主要快捷键

| 功能 | 默认建议组合键 |
| --- | --- |
| 打开 / 关闭助手面板 | `Alt+K` |
| 收藏当前对话 | `Ctrl+Shift+X` |
| 打开提示词选择器（Windows） | `Ctrl+Q` |

这些属于**建议默认键**，不是强制绑定。若组合键与浏览器或其他扩展冲突，可能不会自动分配。请在浏览器的 **扩展程序 → 键盘快捷键** 页面检查、设置或修改实际绑定。

### 已知边界

- 快捷插入只面向受支持的 DeepSeek 网页输入框，不会自动发送。
- 浏览器对扩展快捷键具有最终分配权；提示词选择器 `Ctrl+Q` 的自动默认绑定不保证在每个安装环境成功。
- DeepSeek 页面结构、虚拟滚动及非公开接口发生变化时，部分搜索、收藏或定位能力可能受到影响。
- 数据恢复以安全预检和本地优先合并为原则，并非覆盖式云端同步。
- 其他 AI 平台适配能力仍在持续探索，不将尚未完成的跨平台支持视为本版正式功能。

**反馈与问题：** [GitHub Issues](https://github.com/lOVE-o837/Deepseek-assistant/issues)。

---

## English

### ✨ Prompt Workbench

Save, edit, search, categorize, pin, and batch-organize prompts in a dedicated Workbench. Use folders to keep large libraries manageable, and check formatting in the read-only Markdown preview.

**How to use:** Open the DeepSeek Assistant panel → **Workbench**. Create a prompt or folder, then use search, filters, or batch selection to organize your library.

**Quick insert:** Open the prompt picker from a supported DeepSeek input field, and explicitly choose to insert at the beginning, cursor, or end—or replace the draft. Draft and selection safety checks apply; copying the original prompt remains available as a fallback. **It never sends your message automatically.**

### 📂 Export bookmarks by folder

Conversation, message, and individual formatted-block bookmarking remain available. You can now group selected exports by folder instead of manually picking items one by one.

**Where to find it:** **Bookmarks → Actions → arrow beside Export → Select folders to export**. Choose folder grouping where supported by the export flow.

### 📝 Markdown knowledge notes

Turn saved conversations and messages into reusable Markdown notes. Copy them to your note-taking app or use the Obsidian note-creation entry point. Actual saving in another application must be confirmed there.

### 🛡️ Full backup and safer restore

Back up supported bookmarks, prompts, and related settings through Settings. Before restoring, review the preview and conflict information. Existing local content is preserved on conflicting IDs rather than silently overwritten, and uncertain writes are not automatically retried.

Prompt JSON import/export and supported Markdown/TXT imports are also available. Keep a separate backup before bulk changes.

### 🎨 Improved everyday experience

Refined panel navigation, Settings, theme previews, and confirmation dialogs. The v2.2.0 update notice appears ahead of the formatted-block navigation notice; a separate one-time shortcut banner explains keyboard customization. On first use, the interface follows the browser UI language unless you have selected a language explicitly.

### ⌨️ Main keyboard shortcuts

| Action | Suggested default |
| --- | --- |
| Open / close the panel | `Alt+K` |
| Bookmark the current conversation | `Ctrl+Shift+X` |
| Open the prompt picker (Windows) | `Ctrl+Q` |

Suggested defaults are **not guaranteed assignments**. Browser or extension conflicts may leave a command unassigned. Check and customize bindings under **Extensions → Keyboard shortcuts**.

### Important limitations

- Quick insert works in supported DeepSeek web input fields and does **not** auto-send.
- Browser-controlled shortcut assignment may differ by installation.
- Changes to DeepSeek's page structure, virtual scrolling, or non-public APIs can affect some search, bookmarking, or navigation behaviors.
- Restore is a previewed, local-first safety workflow—not overwrite-style cloud synchronization.
- Support for additional AI platforms is exploratory, not a completed v2.2.0 capability.

**Feedback:** [GitHub Issues](https://github.com/lOVE-o837/Deepseek-assistant/issues).

---

*Release documentation only. No installer assets, source-code changes, or private development history are included in this publication.*