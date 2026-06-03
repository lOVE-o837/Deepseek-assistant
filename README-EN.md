# DeepSeek Assistant 🐋

**A browser extension that enhances the DeepSeek web app, making conversation management more efficient.**

[![Manifest Version](https://img.shields.io/badge/manifest-v3-blue)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![License](https://img.shields.io/badge/license-Apache2.0-green)](./LICENSE)
![Version](https://img.shields.io/badge/version-1.3.0-brightgreen)

## ✨ Core Features

### 🔍 Search Capabilities
- **Dual-mode search** : One-click search through left-side conversation history & current page content, with keyword highlighting and chronological sorting.
- **Enhanced history search** : Manually refresh the conversation list (with concurrency lock), supports exporting to CSV files.
- **Favorites search** : Real-time match count, search scope covers titles, content, notes, and **folder names**.
- **Current conversation search** : Results can be copied as plain text or Markdown with one click.

### ⭐ Favorites (Conversations & Messages)
- **Multiple ways to favorite** : Floating button / `Ctrl+Shift+X` hotkey / right-click context menu.
- **Folder management** : Create custom folders, supports search, rename, delete, and quick filtering via dropdown menu.
- **Enhanced message favorites** : Card-style display, add notes, click to jump back to the original conversation with **precise positioning**.
- **Statistics** : Real-time display of conversation and message favorite counts, along with **today/week new additions**.
- **Time display** : Toggle between relative time ("3 minutes ago") and absolute time ("2026/5/21 14:30") — time descriptions are internationalized.
- **Batch operations** : Clear all favorites with one click (with confirmation dialog).
- **Import/Export** : Supports JSON/TXT/Markdown export (filenames include second-level timestamps), JSON backups can be imported for restoration.

### 🌐 Internationalization (New)
- **Full UI language switching** between English and Chinese – covers all tabs, popups, buttons, tooltips, with approximately **120 translation keys**.
- **Smart language detection** : Automatically detects browser language and applies it; changes take effect instantly without refresh.
- **Extensible** : Adding a new language only requires adding key-value pairs to the language pack – no business code changes needed.

### 🎨 Appearance & Interaction
- **6 built-in themes** : Deep Sea Blue, Classic Black, Eye-friendly Green, plus a custom color picker and system theme follow mode.
- **Panel control** : Long-press and drag the title bar to move the panel; position is remembered per conversation URL. One-click reset of panel position and size.
- **Preset size switching** : Long-press the floating button to open a quick menu, switching panel sizes (original/small/medium/large) – size is automatically remembered.
- **Floating button** : A star (⭐) button at the bottom right corner, supports drag-and-drop repositioning. Long-press for a quick menu (open panel, copy link, change size).
- **Minimize to floating button** : When minimized, the panel shrinks to a small red dot on the floating button; click it to restore.
- **Hotkeys** : `Alt+K` to open the panel, `Ctrl+Shift+X` to favorite a conversation, `Esc` to close the panel.

### 🧩 Other Thoughtful Features
- **Restructured settings page** : A structured settings hub that clearly displays language, quick actions, and data security tips.
- **Storage usage monitor** : Real-time display of used space (exact percentage) – warning at 80%, severe warning at 95%.
- **Folder dropdown menu** : Supports searching folder names, highlights matched keywords, and a "New Folder" button is always visible.
- **Move to folder modal** : Adds a search box, styled scrollbar, match counter – easily locate folders even when you have many.
- **Message card title optimization** : When multiple messages from the same conversation are favorited, the title automatically appends a sequence number (e.g., 2/5).
- **Sidebar collapse hint** : When conversation history search returns ≤3 conversations, a hint prompts you to expand the left sidebar for more records.
- **Export filename timestamps** : Prevents file overwriting when exporting multiple times.
- **Panel boundary protection** : Automatically corrects panel position when the window is resized, ensuring it remains visible.
- **Title bar drag protection** : Requires moving more than 5px to trigger panel dragging, avoiding accidental moves.
- **Font rendering optimization** : Crisp and clear Chinese fonts on Windows, no overlapping strokes.

## 🏗️ Project Structure (v1.3.0 Modular)
DeepSeek-Assistant/
├── manifest.json
├── panel.html              # Panel static structure
├── panel.css               # All styles
├── background.js           # Background relay
├── content.js              # Page interaction
├── panel.js                # Main controller (~250 lines)
└── panel-modules/          # Business modules
    ├── module-i18n.js      # Internationalization
    ├── module-storage.js   # Storage & communication
    ├── module-dom.js       # DOM utilities
    ├── module-theme.js     # Theme system
    ├── module-panel.js     # Panel control
    ├── module-history.js   # History search
    ├── module-search.js    # Conversation search
    ├── module-bookmarks.js # Conversation favorites
    ├── module-messages.js  # Message favorites
    └── module-folders.js   # Folder management

## 📥 Installation

### Method 1: Edge Add-ons Store (Recommended)
> 🔗 **[Click here to install](https://microsoftedge.microsoft.com/addons/)**  
> *(Once the extension is approved, the link will be updated automatically.)*

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
- [Changelog](./CHANGELOG.md) — Version update details
