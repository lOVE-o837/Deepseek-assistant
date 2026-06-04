# FAQ

### 安装与兼容性

**Q：支持哪些浏览器？**  
A：完美支持 Microsoft Edge 和 Google Chrome（基于 Chromium 内核）。Firefox 暂不支持。

**Q：如何安装？**  
A：Edge 用户可从 [Edge 加载项商店](https://microsoftedge.microsoft.com/addons/detail/ofepipaoojckjihdofklifgdobndcfmk) 直接安装。也可从 [GitHub Releases](https://github.com/{{你的用户名}}/Deepseek-assistant/releases) 下载最新版本，打开 `edge://extensions` 或 `chrome://extensions`，开启开发者模式，点击「加载解压缩的扩展」选择解压文件夹。

**Q：需要什么权限？**  
A：仅请求访问 `chat.deepseek.com` 域名，用于注入面板和悬浮按钮。不访问其他网站，不收集个人信息。

---

### 数据与隐私

**Q：我的收藏数据存储在哪里？**  
A：全部存储在浏览器的 `chrome.storage.local` 中，完全本地化，不经过任何远程服务器。

**Q：数据会丢失吗？**  
A：数据随浏览器本地存储保留。建议定期通过面板中的导出功能备份为 JSON 文件，可在重装后导入恢复。

**Q：如何清空所有数据？**  
A：在收藏夹工具栏点击「清空全部收藏」按钮，需二次确认后执行。或在浏览器扩展管理页面移除扩展。

---

### 收藏与搜索

**Q：如何收藏对话？**  
A：三种方式：① 点击右下角 ⭐ 悬浮按钮；② 按快捷键 `Ctrl+Shift+X`；③ 在面板收藏夹中右键选择收藏。

**Q：如何收藏单条消息？**  
A：将鼠标悬停在任意对话消息上，消息右上角会出现 ⭐ 按钮，点击即可收藏。支持收藏 AI 回答和用户提问。

**Q：当前对话搜索为什么找不到远处的消息？**  
A：受 DeepSeek 页面虚拟滚动技术限制，仅能搜索视口附近约 5-8 条消息。建议先滚动到目标区域再搜索，或使用面板中的「历史搜索」检索侧边栏对话列表。

**Q：收藏的消息如何跳转回原对话？**  
A：在消息收藏卡片中点击「打开」按钮，会自动跳转到原对话页面并滚动定位到该消息位置。如消息距离较远可能加载超时，此时会提示手动滚动。

---

### 快捷键

**Q：有哪些快捷键？**  
A：
| 快捷键 | 功能 |
|:---|:---|
| `Alt+K` | 打开/关闭 DeepSeek 助手面板 |
| `Ctrl+Shift+X` | 收藏当前对话 |
| `Esc` | 关闭面板 |

---

### 反馈与支持

**Q：遇到 Bug 如何反馈？**  
A：请在 [GitHub Issues](https://github.com/{{你的用户名}}/Deepseek-assistant/issues) 提交，附上浏览器版本、扩展版本、问题描述和复现步骤。也可在 Edge 商店评论区留言。

**Q：如何提功能建议？**  
A：欢迎在 [GitHub Issues](https://github.com/{{你的用户名}}/Deepseek-assistant/issues) 中提 Feature Request，请描述使用场景和期望效果。
