# DeepSeek 助手 🐋

**增强 DeepSeek 网页版功能的浏览器扩展，让对话管理更高效。**

[![Manifest Version](https://img.shields.io/badge/manifest-v3-blue)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![License](https://img.shields.io/badge/license-Apache2.0-green)](./LICENSE)
![Version](https://img.shields.io/badge/version-1.4.1-brightgreen)

## ✨ 核心功能

### 🔍 搜索能力
- **双模式搜索**：一键检索左侧历史对话 & 当前页面内容搜索，支持关键词高亮、时间排序
- **历史搜索增强**：手动刷新对话列表（防并发锁），支持导出为 CSV 文件
- **收藏夹搜索**：实时统计匹配数量，搜索范围覆盖标题、内容、备注以及**文件夹名称**
- **当前对话搜索**：结果一键复制为纯文本或 Markdown 格式

### ⭐ 收藏夹（对话 & 消息）
- **多种收藏方式**：悬浮按钮 / 快捷键 `Ctrl+Shift+X` / 右键菜单
- **文件夹管理**：自定义文件夹，支持搜索、重命名、删除，通过下拉菜单快速筛选，**选中文件夹后按钮自动显示当前文件夹名**
- **消息收藏增强**：卡片式展示，可添加备注，点击跳转回原对话并**精准定位**
- **统计信息**：对话、消息收藏数量实时显示，并展示**今日/本周新增**；设置页统计卡片同步显示当前文件夹名称
- **时间显示**：支持切换相对时间（3分钟前）与绝对时间（2026/5/21 14:30），时间描述已国际化
- **批量操作**：一键清空全部收藏（带二次确认）
- **导入导出**：支持 JSON/TXT/Markdown 导出（文件名精确到秒），JSON 备份可导入恢复；**Markdown 导出完整保留 AI 代码块**

### 🌐 国际化
- **全界面中英文切换**：覆盖所有标签页、弹窗、提示文字、悬浮菜单，**约 150 个翻译键**
- **智能语言检测**：自动识别浏览器语言并应用，切换即时生效无需刷新
- **Content Script 国际化**：长按菜单、收藏弹窗、消息提示等**页面端 UI 全部支持中英文切换**
- **可扩展**：新增语言只需在语言包中添加翻译键值对，无需修改任何业务代码

### 🎨 外观与操作
- **6套预设主题**：深海蓝、经典黑、护眼绿…… 支持自定义取色器与跟随系统模式
- **🎁 彩蛋主题**：全新隐藏主题特效，可通过社区互动解锁
- **面板控制**：标题栏长按拖拽移动，按对话 URL 记忆位置；一键重置面板位置与尺寸
- **预设尺寸切换**：通过悬浮按钮长按菜单，快速切换面板尺寸（原/小/中/大），尺寸自动记忆
- **悬浮按钮**：右下角 ⭐ 收藏按钮，支持拖拽换位；长按弹出快捷菜单（打开面板、复制链接、切换尺寸）
- **最小化到悬浮按钮**：最小化后面板缩为悬浮按钮上的小红点，点击即可恢复
- **快捷键**：`Alt+K` 呼出面板，`Ctrl+Shift+X` 收藏对话，`Esc` 关闭面板

### 🧩 其他贴心功能
- **设置页重构**：结构化的设置中心，清晰展示语言、快捷操作、数据安全提示，并提供**反馈入口**
- **存储用量监控**：实时显示已用空间（精确到小数点后两位百分比），超过 80% 警告，超过 95% 严重警告
- **文件夹下拉菜单**：支持搜索文件夹名，匹配关键词高亮，新建按钮固定可见
- **移动到文件夹弹窗**：添加搜索框、滚动条美化、匹配计数，文件夹过多时轻松定位
- **消息卡片标题优化**：同对话多条消息收藏时，标题自动追加序号（如 2/5）
- **侧边栏收起提示**：当历史搜索抓取到 ≤3 条对话时，提示展开左侧侧边栏获取更多记录
- **导出文件名时间戳**：避免多次导出时文件重名覆盖
- **面板边界保护**：窗口缩小时自动修正面板位置，确保始终可见
- **标题栏拖拽防误触**：需移动超过 5px 才触发面板拖动
- **字体渲染优化**：Windows 下中文字体清晰锐利，无笔画重叠

## 🏗️ 项目结构（v1.4.1 模块化架构）
```
DeepSeek-Assistant/
├── manifest.json
├── panel.html # 面板静态结构（含主题特效元素）
├── panel.css # 全部样式（含彩蛋主题特效）
├── background.js # 后台中转（消息路由、存储代理）
├── panel.js # 主控（全局状态、初始化、事件绑定、默认主题修复）
├── content/ # Content Script 模块（原 ~2000 行 content.js 拆分）
│ ├── content-utils.js # 纯工具函数（showToast、escapeHTML、getTrustedTitle 等）
│ ├── content-panel.js # 面板 iframe 注入、拖拽、位置记忆
│ ├── content-bookmark.js # 对话收藏 + 消息收藏系统 + 星标按钮注入
│ ├── content-float-btn.js # 悬浮按钮 + 长按菜单 + 尺寸切换
│ ├── content-sidebar.js # 侧边栏对话列表抓取
│ ├── content-search.js # 当前页面内容搜索 + 高亮定位
│ └── content-core.js # 核心骨架（初始化、消息路由、确认对话框、语言同步）
└── panel-modules/ # 面板业务模块
├── module-i18n.js # 国际化（150+ 翻译键，中英文完整覆盖）
├── module-storage.js # 存储与通信
├── module-dom.js # DOM 工具函数（formatTime、debounce、highlightText 等）
├── module-theme.js # 主题定义 + 应用 + 取色器 + 颜色计算（含彩蛋主题）
├── module-panel.js # 标签切换、面板控制、设置页、存储用量、反馈与奖励系统
├── module-history.js # 历史搜索 + CSV 导出
├── module-search.js # 当前对话搜索 + 结果复制
├── module-bookmarks.js # 对话收藏管理（导出/导入/清空/空状态）
├── module-messages.js # 消息收藏管理（卡片渲染/事件绑定/空状态）
└── module-folders.js # 文件夹管理 + 移动弹窗 + 统计条
```

## 📥 安装方式

### 方式一：官方商店（推荐）
| 浏览器 | 商店链接 |
|:---|:---|
| Microsoft Edge | [![Edge Add-ons](https://img.shields.io/badge/Edge-Add--ons-0078D7?style=flat&logo=microsoftedge)](https://microsoftedge.microsoft.com/addons/detail/ofepipaoojckjihdofklifgdobndcfmk) |
| Google Chrome | [![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-4285F4?style=flat&logo=googlechrome)](https://chromewebstore.google.com/detail/mpgaedmobnhoaceeefcafjofclenjbah) |

### 方式二：开发者模式侧载
1. 在本仓库 [Releases](https://github.com/lOVE-o837/Deepseek-assistant/releases) 页面下载最新版本的 `Source code (zip)` 并解压
2. 打开 Edge 浏览器，在地址栏输入 `edge://extensions` 回车
3. 开启左下角的 **"开发人员模式"**
4. 点击 **"加载解压缩的扩展"**，选择刚解压的文件夹即可

> 更多详情请查阅 [KNOWN_ISSUES.md](./KNOWN_ISSUES.md)

## 🤝 参与贡献

欢迎提交 Bug 报告、功能建议或 Pull Request！
请先查阅 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解贡献规范。

## 📄 许可证

本项目基于 [Apache License 2.0](./LICENSE) 开源。

## 📚 文档索引

- [已知问题与限制](./KNOWN_ISSUES.md) — 了解技术限制和常见问题
- [常见问题 (FAQ)](./FAQ.md) — 快速解答使用中的疑惑

## 📝 更新日志

完整版本历史请查阅 [CHANGELOG.md](./CHANGELOG.md)。
