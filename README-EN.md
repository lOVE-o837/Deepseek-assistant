# DeepSeek Assistant 🐋

**A browser extension that enhances the DeepSeek web experience, making conversation management more efficient.**

[![Manifest Version](https://img.shields.io/badge/manifest-v3-blue)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![License](https://img.shields.io/badge/license-Apache2.0-green)](./LICENSE)
![Version](https://img.shields.io/badge/version-1.4.1-brightgreen)

## ✨ Core Features

### 🔍 Search Capabilities
- **Dual-mode search**: One-click retrieval of left sidebar history & current page content search, with keyword highlighting and time sorting.
- **Enhanced history search**: Manually refresh the conversation list (with concurrency lock), supports exporting to CSV files.
- **Favorites search**: Real-time match count, search scope covers titles, content, notes, and **folder names**.
- **Current conversation search**: Results can be copied as plain text or Markdown in one click.

### ⭐ Favorites (Conversations & Messages)
- **Multiple ways to favorite**: Floating button / `Ctrl+Shift+X` shortcut / right-click context menu.
- **Folder management**: Custom folders, supports search, rename, delete, and quick filtering via dropdown menu — **the folder button automatically shows the current folder name when selected**.
- **Enhanced message favorites**: Card-style display with notes; click to jump back to the original conversation with **precise positioning**.
- **Statistics**: Real-time display of conversation and message favorite counts, plus **today/this week additions**; the Settings stats card also shows the current folder name.
- **Time display**: Toggle between relative time ("3 minutes ago") and absolute time ("2026/5/21 14:30") — time descriptions are internationalized.
- **Batch operations**: One-click clear all favorites (with confirmation).
- **Import/Export**: Supports JSON/TXT/Markdown export (filenames include second-level timestamps), JSON backup can be imported for restoration; **Markdown export fully preserves AI code blocks**.

### 🌐 Internationalization
- **Full UI language switching** between English and Chinese — covering all tabs, popups, tooltips, floating menus, with approximately **150 translation keys**.
- **Smart language detection**: Automatically detects browser language and applies it; changes take effect instantly without refresh.
- **Content Script i18n**: Long-press menu, bookmark popup, toast messages — **all page-level UI fully supports language switching**.
- **Extensible**: Adding a new language only requires adding key-value pairs to the language pack — no business code changes needed.

### 🎨 Appearance & Interaction
- **6 preset themes**: Deep Sea Blue, Classic Black, Eye-care Green… plus a custom color picker and system theme follow mode.
- **🎁 Easter egg theme**: A brand-new hidden theme with special effects, unlockable through community interaction.
- **Panel control**: Long-press and drag the title bar to move the panel; position is remembered per conversation URL. One-click reset of panel position and size.
- **Preset size switching**: Long-press the floating button to open a quick menu, switching panel sizes (original/small/medium/large) — size is automatically remembered.
- **Floating button**: A star (⭐) button at the bottom right corner, supports drag-and-drop repositioning. Long-press for a quick menu (open panel, copy link, change size).
- **Minimize to floating button**: When minimized, the panel shrinks to a small red dot on the floating button; click to restore.
- **Hotkeys**: `Alt+K` to open the panel, `Ctrl+Shift+X` to favorite a conversation, `Esc` to close the panel.

### 🧩 Other Thoughtful Features
- **Restructured Settings page**: A structured settings hub that clearly displays language, quick actions, data security tips, and provides a **feedback entry**.
- **Storage usage monitor**: Real-time display of used space (percentage with two decimal places) — warning at 80%, severe warning at 95%.
- **Folder dropdown menu**: Supports searching folder names, highlights matched keywords, and a "New Folder" button is always visible.
- **Move to folder modal**: Adds a search box, styled scrollbar, match counter — easily locate folders even when you have many.
- **Message card title optimization**: When multiple messages from the same conversation are favorited, the title automatically appends a sequence number (e.g., 2/5).
- **Sidebar collapse hint**: When conversation history search returns ≤3 conversations, a hint prompts you to expand the left sidebar for more records.
- **Export filename timestamps**: Prevents file overwriting when exporting multiple times.
- **Panel boundary protection**: Automatically corrects panel position when the window is resized, ensuring it remains visible.
- **Title bar drag protection**: Requires moving more than 5px to trigger panel dragging, avoiding accidental moves.
- **Font rendering optimization**: Crisp and clear Chinese fonts on Windows, no overlapping strokes.

## 🏗️ Project Structure (v1.4.1 Modular Architecture)
```
DeepSeek-Assistant/
├── manifest.json
├── panel.html              # Panel static structure (includes theme effect elements)
├── panel.css               # All styles (includes Easter egg theme effects)
├── background.js           # Background relay (message routing, storage proxy)
├── panel.js                # Main controller (global state, initialization, event binding, default theme fix)
├── content/                # Content Script modules (split from original ~2000-line content.js)
│   ├── content-utils.js        # Pure utility functions (showToast, escapeHTML, getTrustedTitle, etc.)
│   ├── content-panel.js        # Panel iframe injection, dragging, position memory
│   ├── content-bookmark.js     # Conversation + message favorites system, star button injection
│   ├── content-float-btn.js    # Floating button + long-press menu + size switching
│   ├── content-sidebar.js      # Sidebar conversation list scraping
│   ├── content-search.js       # Current page content search + highlight positioning
│   └── content-core.js         # Core skeleton (initialization, message routing, confirm dialogs, language sync)
└── panel-modules/          # Panel business modules
    ├── module-i18n.js      # Internationalization (150+ translation keys, full EN/CN coverage)
    ├── module-storage.js   # Storage & communication
    ├── module-dom.js       # DOM utility functions (formatTime, debounce, highlightText, etc.)
    ├── module-theme.js     # Theme definitions + application + color picker + color calculations (includes Easter egg theme)
    ├── module-panel.js     # Tab switching, panel control, Settings page, storage usage, feedback & reward system
    ├── module-history.js   # History search + CSV export
    ├── module-search.js    # Current conversation search + result copying
    ├── module-bookmarks.js # Conversation favorites management (export/import/clear/empty state)
    ├── module-messages.js  # Message favorites management (card rendering/event binding/empty state)
    └── module-folders.js   # Folder management + move modal + stats bar
```

## 📥 Installation

### Method 1: Edge Add-ons Store (Recommended)
> 🔗 **[Click here to install](https://microsoftedge.microsoft.com/addons/detail/ofepipaoojckjihdofklifgdobndcfmk)**

### Method 2: Developer Mode Sideloading
1. Download the latest `Source code (zip)` from the [Releases](https://github.com/lOVE-o837/Deepseek-assistant/releases) page and extract it.
2. Open Edge browser, type `edge://extensions` in the address bar, and press Enter.
3. Turn on **"Developer mode"** in the bottom left corner.
4. Click **"Load unpacked"** and select the extracted folder.

> For more details, please refer to [KNOWN_ISSUES.md](./KNOWN_ISSUES.md)

## 🤝 Contributing

Bug reports, feature suggestions, and Pull Requests are welcome!
Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first for contribution guidelines.

## 📄 License

This project is open-sourced under the [Apache License 2.0](./LICENSE).

## 📚 Documentation Index

- [Known Issues & Limitations](./KNOWN_ISSUES.md) — Technical constraints and common issues
- [FAQ](./FAQ.md) — Quick answers to your questions

## 📝 Changelog

For full version history, please refer to [CHANGELOG.md](./CHANGELOG.md).
```
