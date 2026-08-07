
---

## README 中文版


# DeepSeek 助手 🐋

**增强 DeepSeek 网页版功能的浏览器扩展，批量操作、格式块收藏、全量搜索、消息预览，让对话管理更高效。**

[![Manifest Version](https://img.shields.io/badge/manifest-v3-blue)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![License](https://img.shields.io/badge/license-Apache2.0-green)](./LICENSE)
![Version](https://img.shields.io/badge/version-1.5.0-brightgreen)

## ✨ 核心功能

### 🔍 三模式搜索
- **历史对话搜索** — API 全量分页获取，秒加载全部对话，显示精确时间戳（今天/昨天/3天前/日期+周几），失败自动降级为侧边栏滚动
- **对话消息搜索** — API 全量获取当前对话消息，支持关键词实时搜索、格式块类型过滤（代码块/表格/数学公式/Mermaid）、角色过滤（AI回答/用户提问）、轮次排序
- **格式块跳转导航** — Ctrl+↑/↓ 快捷键在代码块、表格、标题等格式块之间快速跳转，悬浮菜单可选择优先跳转类型

### ⭐ 批量操作（全新）
- **全选/多选** — 收藏夹、历史搜索、对话消息标签页均支持复选框多选，Shift 连续选择，按"全部/仅对话/仅消息"分类全选
- **批量处理** — 批量删除、批量移动、批量导出、批量收藏、批量备注（覆盖/追加两种模式）
- **操作栏智能显隐** — 选中任意项后底部浮现操作栏，按钮文字精简适配小面板

### 📌 格式块独立收藏（全新）
- **四角星 ✴ 按钮** — 页面中的代码块、表格、数学公式、Mermaid 图表旁自动注入金色四角星按钮，点击即可独立收藏单个格式块
- **五角星 ⭐ 收藏增强** — 收藏整轮 AI 回答时优先通过 API 获取完整原始 Markdown，导出时完美还原表格/代码块/公式
- **导出到 Obsidian** — 导出文件自动清洗 BOM 头、统一换行符、移除零宽字符，拖拽到 Obsidian 可直接触发原生渲染

### 👁️ 消息预览浮层（全新）
- **悬停预览** — 对话搜索和收藏夹标签页均支持鼠标悬停 0.4 秒弹出预览浮层
- **代码语法高亮** — 引入 highlight.js，Python/JavaScript/Mermaid 等语言完整高亮
- **数学公式渲染** — 引入 KaTeX，块级和行内公式可视化渲染
- **智能位置自适应** — 下方优先，空间不足自动翻转，右侧溢出左偏移
- **滑动开关** — 独立控制两个标签页，状态持久化

### 📂 收藏夹（对话 & 消息）
- **多种收藏方式** — 悬浮按钮 / 快捷键 `Ctrl+Shift+X` / 右键菜单
- **文件夹管理** — 自定义文件夹，支持搜索、重命名、删除，通过下拉菜单快速筛选
- **统计信息** — 对话、消息收藏数量实时显示，今日/本周新增
- **时间显示** — 相对时间与绝对时间切换
- **导入导出** — JSON/TXT/Markdown 格式备份
- **对话框片折叠** — 折叠/展开切换，状态持久化

### 🌐 国际化
- **全界面中英文切换** — 覆盖所有标签页、弹窗、提示文字，**240+ 翻译键**
- **智能语言检测** — 自动识别浏览器语言并应用，切换即时生效无需刷新
- **Content Script 国际化** — 页面端按钮、弹窗、提示全部支持中英文切换

### 🎨 外观与操作
- **6套预设主题** + 自定义取色器 + 跟随系统模式
- **🎁 彩蛋主题** — 隐藏款「深海极客」主题，Canvas 粒子特效 + 跑马灯光条 + 金色边框
- **面板拖拽缩放** — 右/下/右下角拖拽调整尺寸（340~900px 宽 / 400~1200px 高），尺寸记忆持久化
- **面板拖拽移动** — 标题栏长按拖拽，按对话 URL 记忆位置
- **悬浮按钮** — 右下角 ⭐ 收藏按钮，长按弹出快捷菜单（打开面板、复制链接、切换尺寸、格式块跳转）
- **快捷键** — `Alt+K` 呼出面板，`Ctrl+Shift+X` 收藏对话，`Ctrl+↑/↓` 格式块跳转

### 🧩 其他贴心功能
- **Canvas 弹窗系统** — 深海极客视觉风格，版本更新弹窗优先显示，格式块提示弹窗在关闭后才弹出
- **存储用量监控** — 实时显示已用空间，超过 80% 警告
- **设置页** — 结构化设置中心，包含反馈入口和专属奖励兑换
- **匿名使用统计** — 仅收集功能使用频率，用于产品改进

## 🏗️ 项目结构（v1.5.0 模块化架构）
```
DeepSeek-Assistant/
├── manifest.json
├── panel.html / panel.css
├── background.js
├── panel.js
├── lib/                     # 第三方库
│   ├── marked.min.js        # Markdown 渲染
│   ├── highlight.min.js     # 代码语法高亮
│   ├── highlight-theme.css
│   ├── katex.min.js         # 数学公式渲染
│   └── katex.min.css
├── content/                 # Content Script 模块
│   ├── content-utils.js
│   ├── content-panel.js
│   ├── content-bookmark.js  # 五角星 ⭐ + 四角星 ✴ 收藏系统
│   ├── content-float-btn.js
│   ├── content-sidebar.js   # API 全量分页 + DOM 降级
│   ├── content-search.js
│   ├── content-canvas-modal.js
│   ├── content-changelog.js
│   └── content-core.js      # 弹窗队列管理器 + API 请求代理
├── panel-modules/           # 面板业务模块
│   ├── module-i18n.js       # 国际化（240+ 翻译键）
│   ├── module-storage.js
│   ├── module-dom.js
│   ├── module-theme.js
│   ├── module-panel.js
│   ├── module-history.js    # API 全量获取 + 精确时间戳
│   ├── module-search.js     # API 全量消息 + 预览浮层 + 批量操作
│   ├── module-bookmarks.js  # SelectionState + 折叠 + 全选模式
│   ├── module-messages.js
│   └── module-folders.js
└── assets/images/
```

## 📥 安装方式

### 方式一：官方商店（推荐）
| 浏览器 | 商店链接 |
|:---|:---|
| Microsoft Edge | [![Edge Add-ons](https://img.shields.io/badge/Edge-Add--ons-0078D7?style=flat&logo=microsoftedge)](https://microsoftedge.microsoft.com/addons/detail/ofepipaoojckjihdofklifgdobndcfmk) |
| Google Chrome | [![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-4285F4?style=flat&logo=googlechrome)](https://chromewebstore.google.com/detail/mpgaedmobnhoaceeefcafjofclenjbah) |

### 方式二：开发者模式侧载
1. 在 [Releases](https://github.com/lOVE-o837/Deepseek-assistant/releases) 页面下载最新版本 `Source code (zip)` 并解压
2. 打开浏览器，地址栏输入 `edge://extensions`（Edge）或 `chrome://extensions`（Chrome）
3. 开启 **"开发人员模式"**
4. 点击 **"加载解压缩的扩展"**，选择解压后的文件夹

## 🤝 参与贡献

欢迎提交 Bug 报告、功能建议或 Pull Request！
请先查阅 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解贡献规范。

## 📄 许可证

本项目基于 [Apache License 2.0](./LICENSE) 开源。

## 📚 文档索引

- [更新日志 (CHANGELOG)](./CHANGELOG.md) — 完整版本历史
- [隐私政策 (PRIVACY)](./PRIVACY.md) — 数据收集与使用说明
```

