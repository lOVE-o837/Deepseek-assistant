---

## README 英文版


# DeepSeek Assistant 🐋

**Enhance your DeepSeek experience — batch operations, block bookmarks, full search, message preview, and more.**

[![Manifest Version](https://img.shields.io/badge/manifest-v3-blue)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![License](https://img.shields.io/badge/license-Apache2.0-green)](./LICENSE)
![Version](https://img.shields.io/badge/version-2.0.0-brightgreen)

## ✨ Core Features

### 🔍 Triple Search Modes
- **History Search** — Full API pagination for instant loading of all conversations, precise timestamps (Today/Yesterday/X days ago), automatic fallback to sidebar scrolling
- **Conversation Message Search** — Full API retrieval of current conversation messages, real-time keyword search, block type filter (code/table/math/Mermaid), role filter (AI/User), round-based sorting
- **Block Navigation** — Ctrl+↑/↓ shortcut to jump between code blocks, tables, headings, and more. Floating menu for priority jump type selection

### ⭐ Batch Operations (New)
- **Multi-select** — Checkboxes in bookmarks, history search, and conversation message tabs. Shift range selection, filter by "All/Conversations/Messages"
- **Batch Actions** — Delete, move, export, bookmark, note (overwrite/append modes)
- **Smart Action Bar** — Floats at the bottom when items are selected, streamlined button text for small panels

### 📌 Block Bookmark (New)
- **✴ Button** — Gold four-pointed star button automatically injected next to code blocks, tables, math formulas, and Mermaid diagrams for independent bookmarking
- **⭐ Enhanced Bookmark** — Full AI responses bookmarked with original Markdown from API, perfect export of tables/code blocks/formulas
- **Obsidian-Ready Export** — Auto-cleansed files (BOM removal, LF normalization, zero-width character removal), drag-and-drop for native rendering

### 👁️ Message Preview Popup (New)
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
- **Collapsible Cards** — Conversation cards fold/expand with state persistence

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
- **Shortcuts** — `Alt+K` toggle panel, `Ctrl+Shift+X` bookmark, `Ctrl+↑/↓` block navigation

### 🧩 More
- **Canvas Modal System** — Deep-sea geek visual style, version update popup prioritized
- **Storage Monitor** — Real-time usage display, warning above 80%
- **Settings Page** — Structured settings center with feedback entry and reward redemption
- **Anonymous Usage Stats** — Function usage frequency only, for product improvement

## 🏗️ Project Structure (v1.5.0 Modular Architecture)
```
DeepSeek-Assistant/
├── manifest.json
├── panel.html / panel.css
├── background.js
├── panel.js
├── lib/                     # Third-party libraries
│   ├── marked.min.js        # Markdown rendering
│   ├── highlight.min.js     # Code syntax highlighting
│   ├── highlight-theme.css
│   ├── katex.min.js         # Math formula rendering
│   └── katex.min.css
├── content/                 # Content Script modules
│   ├── content-utils.js
│   ├── content-panel.js
│   ├── content-bookmark.js  # ⭐ + ✴ bookmark system
│   ├── content-float-btn.js
│   ├── content-sidebar.js   # API pagination + DOM fallback
│   ├── content-search.js
│   ├── content-canvas-modal.js
│   ├── content-changelog.js
│   └── content-core.js      # Popup queue manager + API proxy
├── panel-modules/           # Panel business modules
│   ├── module-i18n.js       # I18n (240+ keys)
│   ├── module-storage.js
│   ├── module-dom.js
│   ├── module-theme.js
│   ├── module-panel.js
│   ├── module-history.js    # API full load + precise timestamps
│   ├── module-search.js     # API messages + preview popup + batch ops
│   ├── module-bookmarks.js  # SelectionState + fold + select-all modes
│   ├── module-messages.js
│   └── module-folders.js
└── assets/images/
```

## 📥 Installation

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

- [Changelog](./CHANGELOG.md) — Full version history
- [Privacy Policy](./PRIVACY.md) — Data collection and usage
```
