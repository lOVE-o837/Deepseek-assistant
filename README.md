# DeepSeek 助手 🐋

**增强 DeepSeek 网页版功能的浏览器扩展，让对话管理更高效。**

[![Manifest Version](https://img.shields.io/badge/manifest-v3-blue)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![License](https://img.shields.io/badge/license-Apache2.0-green)](./LICENSE)

## ✨ 核心功能

- **🔍 双模式搜索**：一键检索历史对话 & 当前页面内容搜索，支持时间排序与关键词高亮
- ⭐ 收藏夹：悬浮按钮 / 快捷键 / 右键菜单三种方式收藏，支持排序、搜索与 JSON/TXT/Markdown 导出备份
- 📁 文件夹分类：自建文件夹整理对话与消息收藏，支持筛选、移动、重命名、删除
- **🎨 6套预设主题**：深海蓝、经典黑、护眼绿…… 支持自定义取色器与跟随系统模式
- **💬 消息精准跳转**：收藏的消息点击即可跳转回原对话并定位
- **⌨️ 高效快捷键**：`Alt+K` 呼出面板，`Ctrl+Shift+X` 一键收藏

## 📥 安装方式

### 方式一：Edge 加载项商店 (推荐)
> 🔗 **[点击此处安装](https://microsoftedge.microsoft.com/addons/)**  
> *（插件审核通过后，链接将自动更新）*

### 方式二：开发者模式侧载
1. 在本仓库顶部点击绿色的 **`<> Code`** 按钮，选择 **`Download ZIP`** 下载并解压
2. 打开 Edge 浏览器，在地址栏输入 `edge://extensions` 回车
3. 开启左下角的 **“开发人员模式”**
4. 点击 **“加载解压缩的扩展”**，选择刚刚解压的文件夹
5. 打开 `https://chat.deepseek.com`，按 `Alt+K` 开始使用

## 🐛 已知问题与限制

技术限制（受限于DeepSeek网页架构，非插件Bug）：
- **当前对话搜索范围**：受虚拟滚动限制，仅覆盖视口附近约5-8条消息
- **消息收藏跳转定位**：极远处消息可能因加载时间过长而超时
- **子对话收藏限制**：同一母对话下的子对话因共享URL，暂不支持独立收藏

> 更多详情请查阅 [KNOWN_ISSUES.md](./KNOWN_ISSUES.md)

## 🤝 参与贡献

欢迎提交 Bug 报告、功能建议或 Pull Request！  
请先查阅 [CONTRIBUTING.md](./CONTRIBUTING.md) 了解贡献规范。

## 📄 许可证

本项目基于 [Apache License 2.0](./LICENSE) 开源。


## 📚 文档索引

- [已知问题与限制](./KNOWN_ISSUES.md) — 了解技术限制和常见问题
- [常见问题 (FAQ)](./FAQ.md) — 快速解答使用中的疑惑
- [更新日志](./CHANGELOG.md) — 查看每个版本的变化
- [贡献指南](./CONTRIBUTING.md) — 了解如何参与项目
- [行为准则](./CODE_OF_CONDUCT.md) — 社区行为规范
