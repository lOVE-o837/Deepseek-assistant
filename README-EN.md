# DeepSeek Assistant 🐋

**Enhance DeepSeek with conversation search, bookmark organization, a prompt workbench, quick insertion, and Markdown knowledge notes.**

[![Manifest Version](https://img.shields.io/badge/manifest-v3-blue)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![License](https://img.shields.io/badge/license-Apache2.0-green)](./LICENSE)
![Version](https://img.shields.io/badge/version-2.2.0-brightgreen)

## ✨ Core Features

### 🧠 Prompt Workbench
- **Prompt Library** — Create, edit, duplicate, title-search, categorize, and pin prompts, with highlighted matches and item counts
- **Markdown Editing & Preview** — Preview supported code blocks, tables, and math; receive confirmation before leaving unsaved edits
- **Custom Folders** — Create, rename, delete, filter, and move prompts by folder; deleting a folder does not delete its prompts
- **Batch Management** — Multi-select, tri-state select-all, bulk pin/unpin, move, and delete with safeguards for destructive actions
- **Import & Export** — Prompt JSON backup/import and supported Markdown / TXT text imports

### ⚡ Quick Prompt Insertion
- **Reuse Prompt Templates** — Insert into supported DeepSeek input fields at the beginning, cursor, or end, or explicitly replace the draft
- **Draft Safety** — Selection and draft-change checks with copy fallback; **messages are never sent automatically**
- **Shortcut Configuration** — Suggested Windows shortcut: `Ctrl+Q`; actual assignments depend on browser shortcut settings

### 🔍 Triple Search Modes
- **History Search** — Full API pagination for instant loading of all conversations, precise timestamps (Today/Yesterday/X days ago), automatic fallback to sidebar scrolling
- **Conversation Message Search** — Full API retrieval of current conversation messages, real-time keyword search, block type filter (code/table/math/Mermaid), role filter (AI/User), round-based sorting
- **Block Navigation** — Ctrl+↑/↓ shortcut to jump between code blocks, tables, headings, and more. Floating menu for priority jump type selection

### ⭐ Batch Operations
- **Multi-select** — Checkboxes in bookmarks, history search, and conversation message tabs. Shift range selection, filter by "All/Conversations/Messages"
- **Batch Actions** — Delete, move, export, bookmark, note (overwrite/append modes)
- **Smart Action Bar** — Floats at the bottom when items are selected, streamlined button text for small panels

### 📌 Block Bookmark
- **✴ Button** — Gold four-pointed star button automatically injected next to code blocks, tables, math formulas, and Mermaid diagrams for independent bookmarking
- **⭐ Enhanced Bookmark** — Full AI responses bookmarked with original Markdown from API, perfect export of tables/code blocks/formulas
- **Obsidian-Ready Export** — Auto-cleansed files (BOM removal, LF normalization, zero-width character removal), drag-and-drop for native rendering

### 👁️ Message Preview Popup
- **Hover Preview** — 0.4s delay popup in both search and bookmarks tabs
- **Syntax Highlighting** — highlight.js for Python, JavaScript, Mermaid, and more
- **Math Rendering** — KaTeX for block and inline formulas
- **Smart Positioning** — Below-first, auto-flip when out of space, left-shift on overflow
- **Toggle Switch** — Independent control for both tabs with state persistence

### 📂 Bookmarks
- **Multiple Ways** — Floating button / shortcut `Ctrl+Shift+X` / context menu
- **Folder Management** — Create, rename, delete folders with search and quick filtering
- **Statistics** — Real-time conversation and message counts, today/week additions
- **Time Display** — Relative and absolute time toggle
- **Import/Export** — JSON/TXT/Markdown backup; bookmarks can also be exported to HTML, browser-print PDF, and Word / DOCX, with better fidelity for code blocks, math formulas, and Mermaid diagrams
- **Export by Folder** — Select bookmark folders and group exported items by folder
- **Markdown Knowledge Notes** — Turn supported bookmarks into Markdown or request note creation via Obsidian; verify saving in the external app
- **Collapsible Cards** — Conversation cards fold/expand with state persistence

### 🛡️ Local Backup & Safe Restore
- **Full Backup** — Export supported bookmarks, prompts, folders, and related settings from Settings
- **Restore Preview** — Review differences and conflicts before confirming; existing local data is protected against silent overwrites

### 🌐 Internationalization
- **Full Chinese/English Toggle** — All tabs, popups, and tooltips covered, **240+ translation keys**
- **Smart Language Detection** — Auto-detects browser language, instant apply without refresh
- **Content Script i18n** — Page-side buttons, popups, and toasts fully localized

### 🎨 Appearance & Interaction
- **6 Preset Themes** + custom color picker + follow system
- **🎁 Hidden Theme** — "Deep Sea Geek" with Canvas particle effects, marquee light bar, and gold border
- **Panel Resize** — Drag right/bottom/corner edges (340-900px width / 400-1200px height), size persisted
- **Panel Drag** — Long-press title bar to move, position remembered per conversation URL
- **Floating Button** — Bottom-right ⭐ bookmark button, long-press for quick menu (open panel, copy link, switch size, block navigation)
- **Shortcuts** — `Alt+K` toggle panel, `Ctrl+Shift+X` bookmark, `Ctrl+↑/↓` block navigation; browser shortcut assignments can be customized

### 🧩 More
- **Canvas Modal System** — Deep-sea geek visual style, version update popup prioritized
- **Storage Monitor** — Real-time usage display, warning above 80%
- **Settings Page** — Structured settings center with feedback entry and reward redemption
- **Limited Usage Statistics** — Feature category, platform, language, version, and time are processed via Cloudflare Workers; request IP may be used server-side for daily deduplication. See the [Privacy Policy](./PRIVACY.md)

## 📥 Installation

Available versions and rollout status are determined by the browser extension stores.


| Browser | Store Link |
|:---|:---|
| Microsoft Edge | [![Edge Add-ons](https://img.shields.io/badge/Edge-Add--ons-0078D7?style=flat&logo=microsoftedge)](https://microsoftedge.microsoft.com/addons/detail/ofepipaoojckjihdofklifgdobndcfmk) |
| Google Chrome | [![Chrome Web Store](https://img.shields.io/badge/Chrome-Web%20Store-4285F4?style=flat&logo=googlechrome)](https://chromewebstore.google.com/detail/mpgaedmobnhoaceeefcafjofclenjbah) |

## 🤝 Contributing

Bug reports, feature suggestions, and pull requests are welcome!
Please read [CONTRIBUTING.md](./docs/CONTRIBUTING.md) first.

## 📄 License

This project is open source under the [Apache License 2.0](./LICENSE).

## 📚 Documentation

- [v2.2.0 What's New / 更新与使用指南](./docs/RELEASE-2.2.0.md) — Release features, usage, and limitations
- [Main README](./README.md) — Product overview and store links
- [中文完整文档](./README-ZN.md) — Chinese documentation

- [Changelog](./CHANGELOG.md) — Full version history
- [Privacy Policy](./PRIVACY.md) — Data collection and usage
```
