// module-i18n.js
 // ==================== 模块: 国际化 I18N ====================
const I18N = {
    zh: { tabHistorySearch: "历史搜索", tabCurrentSearch: "对话搜索", tabBookmarks: "收藏夹", tabTheme: "主题", tabAbout: "设置", settingsTitle: "DeepSeek 助手", settingsVersion: "版本 1.4.0", settingsLanguage: "语言 / Language", settingsLanguageDesc: "选择界面语言", settingsAboutDetails: "详细信息", settingsAboutDetailsDesc: "功能介绍 · 快捷键", settingsCardStats: "📊 收藏统计", settingsCardQuick: "💡 快捷操作",      settingsCardSafety: "⚠️ 数据安全提醒",
      settingsStorageUsage: "💾 存储用量", settingsExportJson: "📥 导出 JSON", settingsOpenBookmarks: "⭐ 打开收藏", settingsSafety1: "更新插件前请务必导出备份。新版本需解压文件夹拖入浏览器，旧数据可能因此丢失。", settingsSafety2: "建议每周定期备份收藏数据，避免意外丢失。", settingsPrivacy: "🔒 所有数据均安全存储于本地，绝不收集或上传任何个人信息。", settingsFooter: "基于 Manifest V3 开发 · 兼容 Edge / Chrome", aboutDetailsFeatures: "功能介绍", aboutDetailsShortcuts: "快捷键", langSelectTitle: "选择语言",       langSearchPlaceholder: "搜索语言...",
      historyLoading: "正在加载对话列表...",
      historyLoadingHint: "正在加载...",
      historyFetchingHint: "正在获取左侧对话列表",
      historyUnknown: "未知搜索",
      historyCountPrefix: "共 ",
      historyCountSuffix: " ",
      historySidebarHint: " 💡 记录较少？尝试展开左侧侧边栏",
      historyNotFound: "未找到匹配记录",
      historyUntitled: "未命名对话",
      historyTypeConv: "对话",
      historyCleared: "🗑️ 搜索历史已清空",
      historyEmptyHint: "使用快捷键 Alt+K 搜索内容后，记录将显示在此处",
      historyEmptyTitle: "暂无搜索历史",
      historyNoExport: "⚠️ 无对话记录可导出",
      historyExported: "📥 已导出 ",
      historySearchPlaceholder: "搜索对话记录...",
      historyBtnRefresh: "🔄 刷新",
      historyBtnExport: "📥 导出",
      historySortAsc: "时间正序",
      historySortDesc: "时间倒序",
      historyRefreshBusy: "⏳ 正在刷新，请稍候",
      historyRefreshed: "✅ 已刷新对话列表",
      historyRefreshFailed: "⚠️ 刷新失败",
      historyRefreshTitle: "强制刷新对话列表",
      historyExportTitle: "导出当前列表为CSV",
      historySortTitle: "切换时间排序", backBtn: "←",       aboutDetailsTitle: "详细信息",
      featHistory: "🔍 <strong>历史搜索</strong> — 检索左侧对话列表，支持时间排序、关键词筛选、手动刷新与 CSV 导出",
      featCurrent: "📄 <strong>当前对话搜索</strong> — 搜索页面内已加载消息，点击后滚动定位并红框高亮闪烁，支持一键复制结果",
      featBookmarks: "⭐ <strong>收藏夹</strong> — 悬浮按钮 / 快捷键 / 右键菜单三种方式收藏，支持排序、全局搜索（含文件夹名匹配）与 JSON/TXT/Markdown 导出备份（文件名精确到秒）",
      featFolders: "📁 <strong>文件夹分类</strong> — 自建文件夹整理对话与消息收藏，下拉菜单支持搜索、高亮匹配和滚动，一键移动到指定文件夹",
      featMsgBookmarks: "💬 <strong>消息收藏</strong> — 逐条收藏用户提问与AI回答，卡片式展示，点击直达原消息精准定位，同对话多条消息标题自动追加序号",
      featStats: "📊 <strong>收藏统计</strong> — 实时显示对话与消息收藏数量及今日/本周新增，按文件夹筛选自动更新",
      featTheme: "🎨 <strong>主题切换</strong> — 6 套预设主题 + 自定义取色器 + 跟随系统，面板与悬浮按钮同步换肤，深海蓝主题增强蓝色氛围",
      featDrag: "🖱️ <strong>面板拖拽与尺寸</strong> — 标题栏长按拖拽移动（防误触阈值），按对话记忆位置；一键重置位置与尺寸；预设四档尺寸切换（原/小/中/大）",
      featFloatBtn: "💡 <strong>悬浮按钮增强</strong> — 长按弹出快捷菜单（打开面板/复制链接/切换尺寸），面板最小化后显示小红点提示",
      featAbsTime: "⏰ <strong>显示绝对时间</strong> — 支持切换相对时间与绝对时间显示，开关贴底，状态持久化",
      featClearAll: "🗑️ <strong>一键清空收藏</strong> — 操作菜单中可一键清空全部对话与消息收藏，带二次确认",
      featReset: "🔄 <strong>重置面板</strong> — 标题栏 ⟲ 按钮一键恢复面板默认位置和尺寸，同时清除尺寸记忆",
      shortcutTitle: "快捷键",
      shortcutAltK: "呼出/关闭面板",
      shortcutCtrlShiftX: "收藏当前对话",
      shortcutEsc: "关闭面板",
      shortcutEnter: "执行搜索",
      settingsConvLabel: "对话",
      settingsMsgLabel: "消息",
      totalText: "总计",
      foldersDropdownSearch: "搜索文件夹...",
      foldersRenameTitle: "重命名文件夹",
      foldersDeleteTitle: "删除文件夹",
      foldersNewFolderTitle: "新建文件夹",
      searchTypeHint: "输入关键词后按回车或点击搜索",
      searchEmptyHint2: "⚠️ 受页面虚拟滚动限制，仅能搜索到视口附近约 5-8 条消息",
      searchEmptyHint3: "💡 建议：滚动到目标区域后再搜索，或使用DeepSeek官方的全局搜索查找",      
      themeNameFollowSystem: "跟随系统",
      themeNameDeepBlue: "深海蓝",
      themeNameMinimalWhite: "极简白",
      themeNameClassicBlack: "经典黑",
      themeNameEyeGreen: "护眼绿",
      themeNameWarmOrange: "暖阳橙",
      themeNameNightPurple: "暗夜紫",
      themeNameCustom: "创建我的主题",
      themeNameMyCustom: "我的主题",
      themeBadgeActive: "使用中",
      themeCustomSaved: "✅ 自定义主题已保存并应用",
      searchInputPlaceholder: "搜索关键词...",
      searchExecBtn: "搜索",
      searchEmptyTitle: "在当前页面对话内容中搜索",
      searchEmptyHint: "支持搜索对话标题、用户消息和AI回复内容",
      bookmarkSortNewest: "按时间降序",
      bookmarkSortOldest: "按时间升序",
      bookmarkSortTitle: "按标题排序",
      bookmarkOpsExport: "导出",
      bookmarkOpsImport: "导入",
      bookmarkOpsClear: "清空",
      bookmarkOpsBtn: "操作",
      foldersAll: "全部",
      foldersNew: "＋",
      foldersCustom: "📁 自定义收藏",
      foldersSearchPlaceholder: "搜索文件夹...",
      foldersMoveTitle: "移动到文件夹",
      foldersNewFolder: "新建文件夹",
      foldersNewFolderBtn: "＋ 新建文件夹",
      foldersCreatePrompt: "请输入文件夹名称：",
      foldersCreated: "✅ 文件夹已创建",
      foldersRenamePrompt: "重命名文件夹：",
      foldersRenamed: "✅ 文件夹已重命名",
      foldersDeleteConfirmPrefix: "确定删除文件夹\"",
      foldersDeleteConfirmSuffix: "\"？（收藏项不丢失）",
      foldersDeleted: "🗑️ 文件夹已删除",
      foldersStatsAll: "全部",
      foldersStatsSelected: "选中文件夹",
      foldersStatsConv: "对话",
      foldersStatsMsg: "消息",
      foldersDeltaToday: "今日+",
      foldersDeltaWeek: "本周+",
      open: "打开",
      note: "备注",
      delete: "删除",
      moveTo: "移动到…",
      displayAbsoluteTime: "显示绝对时间",
      bookmarksCountPrefix: "共 ",
      bookmarksCountSuffix: " 项收藏",
      messagesCountPrefix: "📝 消息收藏 ",
      messagesCountSuffix: " 项",
      colorPickerTitle: "🎨 创建我的主题",
      colorPickerPrimaryLabel: "主色调",
      colorPickerBgLabel: "背景色",
      colorPickerTextLabel: "文字色",
      colorPickerPreviewLabel: "实时预览",
      colorPickerPreviewText: "预览效果",
      cancel: "取消",
      saveAndApply: "保存并应用",
      themeReset: "恢复默认设置",
      themeTitle: "🎨 选择主题",
      searchEnterKeyword: "⚠️ 请输入搜索关键词",
      searchSearching: "正在搜索...",
      searchFailed: "搜索失败，请重试",
      searchNotFoundPrefix: "未找到\"",
      searchNotFoundSuffix: "\"的相关内容",
      searchNoMatch: "未找到匹配内容",
      searchTryOther: "请尝试其他关键词",
      searchFoundPrefix: "找到 ",
      searchFoundSuffix: " 条匹配结果",
      searchCopyBtn: "📋 复制结果",
      searchMatchItem: "匹配项 #",
      searchTypeContent: "内容",
      searchNoCopy: "⚠️ 没有可复制的结果",
      searchClipPrefix: "🔍 DeepSeek助手搜索结果（共 ",
      searchClipSuffix: " 条）",
      searchCopiedPrefix: "📋 已复制 ",
      searchCopiedSuffix: " 条结果到剪贴板",
      searchCopyFailed: "❌ 复制失败，请手动复制",
      searchSortAsc: "时间正序",
      searchSortDesc: "时间倒序",
      historyCsvTitle: "标题",
      historyCsvUrl: "URL",
      historyCsvTime: "时间",
      historySearchType: "搜索",
      fontSize: "字体大小",
      fontSmall: "小",
      fontMedium: "中",
      fontLarge: "大",
      floatBtn: "悬浮按钮",
      floatBtnDesc: "在DeepSeek页面显示悬浮收藏按钮",
      bookmarkSearchPlaceholder: "搜索收藏项...",
      exportDialogTitle: "📥 导出收藏夹",
      exportDialogHint: "请选择导出格式：",
      exportJSON: "导出为 JSON（备份文件）",
      exportTXT: "导出为 TXT（纯文本文档）",
      exportMD: "导出为 Markdown（笔记）",
      timeJustNow: "刚刚",
      timeMinAgo: "分钟前",
      timeHourAgo: "小时前",
      timeDayAgo: "天前",
      messagesAI: "AI回答",
      messagesUser: "用户消息",
      bookmarksCountMatchPrefix: "共 ",
      bookmarksCountMatchMid: " 项，匹配 ",
      bookmarksCountMatchSuffix: " 项",
      foldersMoveMatch: "匹配",
      foldersMoveAll: "全部（无分类）",
      bookmarksEditPrompt: "编辑备注（支持纯文本）：",
      messagesEditPrompt: "编辑备注（支持纯文本）：",
      bookmarksLocated: "已定位到收藏消息",
      bookmarkConfirmTitle: "⭐ 收藏当前对话",
      bookmarkConfirmMsg: "是否收藏当前对话？",
      bookmarkNotePrompt: "请输入收藏备注（可选）：",
      messageAlreadyBookmarked: "⚠️ 此消息已在收藏夹中",
      messageBookmarked: "⭐ 已收藏此消息",
      bookmarkDeleted: "🗑️ 对话收藏已删除",
      messageDeleted: "🗑️ 消息收藏已删除",
      foldersMoved: "✅ 已移动",
      bookmarkShortcutTip: "⭐ 已收藏当前对话",
      bookmarked: "已收藏",
      floatBtnBookmarked: "已收藏 / 拖拽移动 (Alt+K 打开面板)",
      themeResetDone: "✅ 已恢复默认设置",
      bookmarksOpen: "打开",
      bookmarksNoteBtn: "备注",
      bookmarksDelete: "删除",
      bookmarksMoveTo: "移动到…",
      bookmarksExportMDDone: "📥 Markdown 已导出",
      bookmarksImported: "📥 导入完成：对话收藏 ",
      bookmarksImportedMid: " 项，消息收藏 ",
      bookmarksImportedEnd: " 项",
      bookmarksImportFormatErr: "⚠️ 文件格式错误，请使用有效 JSON",
      bookmarksImportFailed: "❌ 导入失败",
      bookmarksImportNoNew: "ℹ️ 无新增收藏项",
      bookmarksEmptyClear: "ℹ️ 收藏夹已为空",
      bookmarksCleared: "🗑️ 收藏已全部清空",
      bookmarksExportDone: "📥 已导出 ",
      bookmarksExportMid: " 项对话 + ",
      bookmarksExportEnd: " 项消息",
      messageNotFoundInBookmarks: "⚠️ 未找到该收藏消息，可能已被删除",
      messageNotLoaded: "📌 消息未加载，正在为您打开对应对话...",
      messageSearchFailed: "🔍 未找到该消息，可能原因：消息已被删除或未加载。请尝试：1. 滚动对话页面加载更早消息；2. 刷新后重试。",
      messageSearchTip: "💡 提示：您可以在「历史搜索」中找到该对话并手动定位",
      bookmarkFailed: "❌ 收藏失败",
      conversationAlreadyBookmarked: "⚠️ 该对话已在收藏夹中",
      messageBookmarkFailed: "❌ 消息收藏失败",
      langSwitchedTo: "✅ 已切换为",
      bookmarksNoMatch: "未找到匹配收藏项",
      bookmarksUntitled: "未命名对话",
      bookmarksEmptyExport: "⚠️ 收藏夹为空，无法导出",
      clearAllConfirmPrefix: "确认清空全部收藏？\n\n💬 对话收藏：",
      clearAllConfirmConv: " 项\n📝 消息收藏：",
      clearAllConfirmSuffix: " 项\n\n此操作不可恢复。",
      messagesUntitled: "未命名对话",
      noteLabel: "备注",
      connecting: "正在连接...",
      waitingForPage: "等待页面就绪...",
      connectingPage: "正在连接页面...",
      minimize: "最小化",
      closePanel: "关闭 (Alt+K)"
    },

    en: { tabHistorySearch: "History", tabCurrentSearch: "Current", tabBookmarks: "Bookmarks", tabTheme: "Theme", tabAbout: "Settings", settingsTitle: "DeepSeek Assistant", settingsVersion: "Version 1.4.0", settingsLanguage: "Language", settingsLanguageDesc: "Select interface language", settingsAboutDetails: "Details", settingsAboutDetailsDesc: "Features · Shortcuts", settingsCardStats: "📊 Bookmark Stats", settingsCardQuick: "💡 Quick Actions", settingsExportJson: "📥 Export JSON", settingsOpenBookmarks: "⭐ Open Bookmarks",       settingsCardSafety: "⚠️ Data Safety",
      settingsStorageUsage: "💾 Storage Usage", settingsSafety1: "Please export backups before updating. New versions require drag-and-drop of extracted folders, which may erase old data.", settingsSafety2: "We recommend weekly backups of your bookmarks to prevent accidental loss.", settingsPrivacy: "🔒 All data is stored locally. No personal information is collected or uploaded.", settingsFooter: "Built with Manifest V3 · Compatible with Edge / Chrome", aboutDetailsFeatures: "Features", aboutDetailsShortcuts: "Shortcuts", langSelectTitle: "Select Language",       langSearchPlaceholder: "Search languages...",
      historyLoading: "Loading conversations...",
      historyLoadingHint: "Loading...",
      historyFetchingHint: "Fetching sidebar conversation list",
      historyUnknown: "Unknown search",
      historyCountPrefix: "Total: ",
      historyCountSuffix: "",
      historySidebarHint: " 💡 Few results? Try expanding the left sidebar",
      historyNotFound: "No matching records found",
      historyUntitled: "Untitled conversation",
      historyTypeConv: "Conversation",
      historyCleared: "🗑️ Search history cleared",
      historyEmptyHint: "Records will appear here after searching with Alt+K",
      historyEmptyTitle: "No search history yet",
      historyNoExport: "⚠️ No conversations to export",
      historyExported: "📥 Exported ",
      historySearchPlaceholder: "Search conversations...",
      historyBtnRefresh: "🔄 Refresh",
      historyBtnExport: "📥 Export",
      historySortAsc: "Oldest first",
      historySortDesc: "Newest first",
      historyRefreshBusy: "⏳ Refresh in progress, please wait",
      historyRefreshed: "✅ Conversation list refreshed",
      historyRefreshFailed: "⚠️ Refresh failed",
      historyRefreshTitle: "Force refresh conversation list",
      historyExportTitle: "Export current list as CSV",
      historySortTitle: "Toggle time sort order", backBtn: "←",       aboutDetailsTitle: "Details",
      featHistory: "🔍 <strong>History Search</strong> — Search conversations in the left sidebar with keyword filtering, time sorting, manual refresh, and CSV export",
      featCurrent: "📄 <strong>Current Page Search</strong> — Search loaded messages on the page, scroll to results with red highlight animation, one-click copy all results",
      featBookmarks: "⭐ <strong>Bookmarks</strong> — Bookmark via floating button / shortcut / context menu, with sorting, global search (including folder names), and JSON/TXT/Markdown export with timestamps",
      featFolders: "📁 <strong>Folder Management</strong> — Organize conversation and message bookmarks with custom folders, dropdown menu with search, highlight matching, and one-click move",
      featMsgBookmarks: "💬 <strong>Message Bookmarks</strong> — Bookmark individual user prompts and AI responses as cards, click to jump to the exact message with precise positioning, auto-numbered titles for same-conversation messages",
      featStats: "📊 <strong>Bookmark Statistics</strong> — Real-time display of conversation and message bookmark counts plus today/week increments, auto-updates per folder filter",
      featTheme: "🎨 <strong>Theme Switcher</strong> — 6 preset themes + custom color picker + follow system, synced with floating button, enhanced deep blue theme",
      featDrag: "🖱️ <strong>Panel Drag & Resize</strong> — Drag panel by title bar with misclick threshold, position remembered per conversation URL; one-click reset; four preset sizes (Original/Small/Medium/Large)",
      featFloatBtn: "💡 <strong>Floating Button Enhancements</strong> — Long-press for quick menu (open panel / copy link / switch size), red dot indicator when panel minimized",
      featAbsTime: "⏰ <strong>Absolute Time Display</strong> — Toggle between relative and absolute time format, persistent switch pinned to bottom",
      featClearAll: "🗑️ <strong>Clear All Bookmarks</strong> — One-click clear all conversation and message bookmarks from the action menu, with confirmation dialog",
      featReset: "🔄 <strong>Reset Panel</strong> — Click ⟲ in title bar to restore default panel position and size, clears size memory",
      shortcutTitle: "Shortcuts",
      shortcutAltK: "Open/Close panel",
      shortcutCtrlShiftX: "Bookmark current conversation",
      shortcutEsc: "Close panel",
      shortcutEnter: "Execute search",
      settingsConvLabel: "Conversations",
      settingsMsgLabel: "Messages",
      totalText: "Total",
      foldersDropdownSearch: "Search folders...",
      foldersRenameTitle: "Rename folder",
      foldersDeleteTitle: "Delete folder",
      foldersNewFolderTitle: "New folder",
      themeNameFollowSystem: "Follow System",
      themeNameDeepBlue: "Deep Blue",
      themeNameMinimalWhite: "Minimal White",
      themeNameClassicBlack: "Classic Black",
      themeNameEyeGreen: "Eye Green",
      themeNameWarmOrange: "Warm Orange",
      themeNameNightPurple: "Night Purple",
      themeNameCustom: "Create My Theme",
      themeNameMyCustom: "My Theme",
      themeBadgeActive: "Active",
      themeCustomSaved: "✅ Custom theme saved and applied",
      searchInputPlaceholder: "Search keyword...",
      searchExecBtn: "Search",
      searchEmptyTitle: "Search in current conversation",
      searchEmptyHint: "Search conversation titles, user messages, and AI replies",
      bookmarkSortNewest: "Newest first",
      bookmarkSortOldest: "Oldest first",
      bookmarkSortTitle: "By title",
      bookmarkOpsExport: "Export",
      bookmarkOpsImport: "Import",
      bookmarkOpsClear: "Clear",
      bookmarkOpsBtn: "Actions",
      foldersAll: "All",
      foldersNew: "＋",
      foldersCustom: "📁 Custom Folders",
      foldersSearchPlaceholder: "Search folders...",
      foldersMoveTitle: "Move to folder",
      foldersNewFolder: "New folder",
      foldersNewFolderBtn: "＋ New folder",
      foldersCreatePrompt: "Enter folder name:",
      foldersCreated: "✅ Folder created",
      foldersRenamePrompt: "Rename folder:",
      foldersRenamed: "✅ Folder renamed",
      foldersDeleteConfirmPrefix: "Delete folder \"",
      foldersDeleteConfirmSuffix: "\"? (Bookmarks won't be lost)",
      foldersDeleted: "🗑️ Folder deleted",
      foldersStatsAll: "All",
      foldersStatsSelected: "Selected folder",
      foldersStatsConv: "Conversations",
      foldersStatsMsg: "Messages",
      foldersDeltaToday: "Today+",
      foldersDeltaWeek: "Week+",
      open: "Open",
      note: "Note",
      delete: "Del",
      moveTo: "Move",
      displayAbsoluteTime: "Abs. Time",
      searchTypeHint: "Type a keyword and press Enter or click Search",      
      searchEmptyHint2: "⚠️ Due to virtual scrolling, only ~5-8 nearby messages are searchable",
      searchEmptyHint3: "💡 Tip: Scroll to target area before searching, or use DeepSeek's built-in search",
      bookmarksCountPrefix: "Total: ",
      bookmarksCountSuffix: " bookmarks",
      messagesCountPrefix: "📝 Messages: ",
      messagesCountSuffix: " items",
      colorPickerTitle: "Create My Theme",
      colorPickerPrimaryLabel: "Primary Color",
      colorPickerBgLabel: "Background",
      colorPickerTextLabel: "Text Color",
      colorPickerPreviewLabel: "Live Preview",
      colorPickerPreviewText: "Preview Text",
      cancel: "Cancel",
      saveAndApply: "Save & Apply",
      themeReset: "Reset Defaults",
      themeTitle: "🎨 Select Theme",
      searchEnterKeyword: "⚠️ Please enter a search keyword",
      searchSearching: "Searching...",
      searchFailed: "Search failed, please retry",
      searchNotFoundPrefix: "No results for \"",
      searchNotFoundSuffix: "\"",
      searchNoMatch: "No matching content",
      searchTryOther: "Try other keywords",
      searchFoundPrefix: "Found ",
      searchFoundSuffix: " results",
      searchCopyBtn: "📋 Copy",
      searchMatchItem: "Match #",
      searchTypeContent: "Content",
      searchNoCopy: "⚠️ No results to copy",
      searchClipPrefix: "🔍 Search Results (",
      searchClipSuffix: " items)",
      searchCopiedPrefix: "📋 Copied ",
      searchCopiedSuffix: " results",
      searchCopyFailed: "❌ Copy failed",
      searchSortAsc: "Oldest first",
      searchSortDesc: "Newest first",
      historyCsvTitle: "Title",
      historyCsvUrl: "URL",
      historyCsvTime: "Time",
      historySearchType: "Search",
      fontSize: "Font Size",
      fontSmall: "Small",
      fontMedium: "Medium",
      fontLarge: "Large",
      floatBtn: "Floating Button",
      floatBtnDesc: "Show floating bookmark button on DeepSeek pages",
      bookmarkSearchPlaceholder: "Search bookmarks...",
      exportDialogTitle: "📥 Export Bookmarks",
      exportDialogHint: "Choose format:",
      exportJSON: "JSON (Backup)",
      exportTXT: "TXT (Plain Text)",
      exportMD: "Markdown (Notes)",
      timeJustNow: "just now",
      timeMinAgo: "m ago",
      timeHourAgo: "h ago",
      timeDayAgo: "d ago",
      messagesAI: "AI",
      messagesUser: "User",
      bookmarksCountMatchPrefix: "Total ",
      bookmarksCountMatchMid: " items, matching ",
      bookmarksCountMatchSuffix: " items",
      foldersMoveMatch: "matching",
      foldersMoveAll: "All (uncategorized)",
      bookmarksEditPrompt: "Edit note (plain text):",
      messagesEditPrompt: "Edit note (plain text):",
      bookmarksLocated: "Message located",
      bookmarkConfirmTitle: "⭐ Bookmark Conversation",
      bookmarkConfirmMsg: "Bookmark this conversation?",
      bookmarkNotePrompt: "Add bookmark note (optional):",
      messageAlreadyBookmarked: "⚠️ This message is already bookmarked",
      messageBookmarked: "⭐ Message bookmarked",
      bookmarkDeleted: "🗑️ Conversation bookmark deleted",
      messageDeleted: "🗑️ Message bookmark deleted",
      foldersMoved: "✅ Moved",
      bookmarkShortcutTip: "⭐ Conversation bookmarked",
      bookmarked: "Bookmarked",
      floatBtnBookmarked: "Bookmarked / Drag to move (Alt+K to open panel)",
      themeResetDone: "✅ Default settings restored",
      bookmarksOpen: "Open",
      bookmarksNoteBtn: "Note",
      bookmarksDelete: "Delete",
      bookmarksMoveTo: "Move to…",
      bookmarksExportMDDone: "📥 Markdown exported",
      bookmarksImported: "📥 Imported: ",
      bookmarksImportedMid: " conversations, ",
      bookmarksImportedEnd: " messages",
      bookmarksImportFormatErr: "⚠️ Invalid file format, use valid JSON",
      bookmarksImportFailed: "❌ Import failed",
      bookmarksImportNoNew: "ℹ️ No new items to import",
      bookmarksEmptyClear: "ℹ️ Bookmarks already empty",
      bookmarksCleared: "🗑️ All bookmarks cleared",
      bookmarksExportDone: "📥 Exported ",
      bookmarksExportMid: " conversations + ",
      bookmarksExportEnd: " messages",
      messageNotFoundInBookmarks: "⚠️ Message not found in bookmarks, may have been deleted",
      messageNotLoaded: "📌 Message not loaded, opening conversation...",
      messageSearchFailed: "🔍 Message not found. Possible reasons: deleted or not loaded. Try scrolling to load more messages or refresh the page.",
      messageSearchTip: "💡 Tip: Find this conversation in History Search and manually locate it",
      bookmarkFailed: "❌ Bookmark failed",
      conversationAlreadyBookmarked: "⚠️ This conversation is already bookmarked",
      messageBookmarkFailed: "❌ Message bookmark failed",
      langSwitchedTo: "✅ Switched to",
      bookmarksNoMatch: "No matching bookmarks",
      bookmarksUntitled: "Untitled conversation",
      bookmarksEmptyExport: "⚠️ No bookmarks to export",
      clearAllConfirmPrefix: "Clear all bookmarks?\n\n💬 Conversations: ",
      clearAllConfirmConv: "\n📝 Messages: ",
      clearAllConfirmSuffix: "\n\nThis action cannot be undone.",
      messagesUntitled: "Untitled conversation",
      noteLabel: "Note",
      connecting: "Connecting...",
      waitingForPage: "Waiting for page...",
      connectingPage: "Connecting to page...",
      minimize: "Minimize",
      closePanel: "Close (Alt+K)"
    }
  };
  function t(key) {
    const lang = state.preferredLanguage || 'zh';
    return (I18N[lang] && I18N[lang][key]) || key;
  }
  
  // ==================== 语言切换 ====================

  // 检测浏览器语言，提取主语言代码并校验是否在支持列表中
  function detectBrowserLanguage() {
    const lang = navigator.language || 'zh';
    const code = lang.split('-')[0].toLowerCase();
    return ['zh','en','ru','id','pt','vi'].includes(code) ? code : 'en';
  }


   // 切换界面语言：持久化偏好、刷新语言子视图、更新标签栏按钮和历史工具栏文本
  async function switchLanguage(langCode) {
    // 检查语言是否支持（目前只支持 zh 和 en）
    if (langCode !== 'zh' && langCode !== 'en') {
      showToast(t('langNotSupported'));
      return;
    }
    state.preferredLanguage = langCode;
    await storageSet('preferred_language', langCode);

    // 切换成功提示
    var langNames = { zh: '中文', en: 'English' };
    var switchedTo = langNames[langCode] || langCode;
    showToast(t('langSwitchedTo') + ' ' + switchedTo);

    // 更新语言子视图的高亮状态
    document.querySelectorAll('.lang-option').forEach(function(el) {
      if (el.getAttribute('data-lang') === langCode) {
        el.style.fontWeight = '600';
        el.style.color = 'var(--panel-accent)';
      } else {
        el.style.fontWeight = '';
        el.style.color = '';
      }
    });
    
    // 更新设置主视图中的当前语言标签
    const label = document.getElementById('current-lang-label');
    if (label) {
      const names = { zh: '中文', en: 'English', ru: 'Русский', id: 'Bahasa Indonesia', pt: 'Português', vi: 'Tiếng Việt' };
      label.textContent = names[langCode] || langCode;
    }
    
    // 切换后移除搜索框焦点
    const input = document.getElementById('lang-search-input');
    if (input) input.blur();
    
    // 如果当前正在语言子视图内，重新渲染语言子视图以应用新语言
    const langView = document.getElementById('subview-language');
    if (langView && langView.style.display !== 'none' && typeof showSubView === 'function') {
      showSubView('language');
    }
    
    // 刷新历史搜索工具栏文本
    if (typeof updateHistoryToolbarText === 'function') updateHistoryToolbarText();

    // 刷新标签栏按钮文本
    document.querySelectorAll('.tab-btn').forEach(btn => {
      const tabId = btn.getAttribute('data-tab');
      const label = btn.querySelector('.tab-label');
      if (!label || !tabId) return;
      const i18nMap = {
        'history-search': 'tabHistorySearch',
        'current-search': 'tabCurrentSearch',
        'bookmarks': 'tabBookmarks',
        'theme': 'tabTheme',
        'about': 'tabAbout'
      };
      const key = i18nMap[tabId];
      if (key) label.textContent = t(key);
    });

    // 刷新当前对话搜索UI
    var si = document.getElementById('current-search-input');
    if (si) si.placeholder = t('searchInputPlaceholder');
    var sb = document.getElementById('btn-current-search-exec');
    if (sb) sb.textContent = t('searchExecBtn');

    var sortBtn = document.getElementById('btn-current-sort');
    if (sortBtn && sortBtn.style.display !== 'none') {
    sortBtn.textContent = state.currentSortOrder === 'desc' ? t('searchSortAsc') : t('searchSortDesc');
   }

    var ccb = document.getElementById('copy-current-results-btn');
    if (ccb) ccb.innerHTML = t('searchCopyBtn');

    // 刷新收藏夹排序和操作按钮
    document.querySelectorAll('#bookmark-sort option').forEach(function(o) {
      var m = { newest: 'bookmarkSortNewest', oldest: 'bookmarkSortOldest', title: 'bookmarkSortTitle' };
      if (m[o.value]) o.textContent = t(m[o.value]);
    });
    var ob = document.getElementById('btn-bookmark-ops');
    if (ob) ob.textContent = t('bookmarkOpsBtn');
    document.querySelectorAll('#bookmark-ops-menu [data-action]').forEach(function(b) {
      var m = { export: 'bookmarkOpsExport', import: 'bookmarkOpsImport', clear: 'bookmarkOpsClear' };
      if (m[b.getAttribute('data-action')]) b.textContent = t(m[b.getAttribute('data-action')]);
    });

    // 如果当前在收藏夹标签页，先重载数据再刷新视图
    if (state.currentTab === 'bookmarks') {
      if (typeof loadBookmarkData === 'function') {
        await loadBookmarkData();
      }
      if (typeof renderMessageBookmarks === 'function') {
        await renderMessageBookmarks();
      }
    }

    // 强制刷新当前标签页以应用新语言
    if (typeof switchTab === 'function') {
      switchTab(state.currentTab);
    }

    // --- 终极静态文本刷新 (直接操作，不依赖外部脚本) ---
    // 1. 处理所有带 data-i18n 属性的元素 (文本内容)
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = t(key);
      }
    });

    // 2. 处理所有带 data-i18n-placeholder 属性的元素 (占位符)
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (key) {
        el.placeholder = t(key);
      }
    });

    // 3. 处理特殊ID元素 (双保险，以防data-i18n未覆盖)
    var specialIds = {
      'toggle-absolute-time-label': 'displayAbsoluteTime',
      'theme-reset-label': 'themeReset',
      'settings-title': 'settingsTitle',
      'theme-title': 'themeTitle',
      'theme-font-size-label': 'fontSize',
      'theme-font-small': 'fontSmall',
      'theme-font-medium': 'fontMedium',
      'theme-font-large': 'fontLarge',
      'theme-float-btn-label': 'floatBtn',
      'theme-float-btn-desc': 'floatBtnDesc',
      'color-picker-title': 'colorPickerTitle',
      'color-picker-primary-label': 'colorPickerPrimaryLabel',
      'color-picker-bg-label': 'colorPickerBgLabel',
      'color-picker-text-label': 'colorPickerTextLabel',
      'color-picker-preview-label': 'colorPickerPreviewLabel',
      'color-picker-preview-text': 'colorPickerPreviewText',
      'btn-color-picker-cancel': 'cancel',
      'btn-color-picker-save': 'saveAndApply'
    };
    for (var id in specialIds) {
      var el = document.getElementById(id);
      if (el && !el.hasAttribute('data-i18n')) { // 避免和通用处理冲突
        el.textContent = t(specialIds[id]);
      }
    }

    // 4. 修复一些可能被遗漏的特定文本 (硬编码修正)
    var historySearchInput = document.getElementById('history-search-input');
    if (historySearchInput) historySearchInput.placeholder = t('historySearchPlaceholder');
    
    // 最后一道防线：强制刷新所有静态文本
    refreshAllStaticText();

    // 收藏夹数据强制刷新（解决语言切换后按钮、统计、空状态不更新的问题）
    if (state.currentTab === 'bookmarks') {
      if (typeof loadBookmarkData === 'function') {
        await loadBookmarkData();
      }
      if (typeof renderMessageBookmarks === 'function') {
        await renderMessageBookmarks();
      }
      // 数据加载完成后，再次刷新静态文本，确保空状态被正确覆盖
      refreshAllStaticText();
    }

    // 强制设置收藏夹搜索框占位符
    var bookmarkInput = document.getElementById('bookmark-search-input');
    if (bookmarkInput) bookmarkInput.placeholder = t('bookmarkSearchPlaceholder');

    // 如果当前对话搜索有缓存结果，用当前语言重新渲染
    if (state.currentSearchResults && state.currentSearchResults.length > 0) {
        var cachedResults = state.currentSearchResults;
        var cachedQuery = state.currentSearchQuery;
        if (typeof renderSearchResults === 'function') {
            renderSearchResults(cachedResults, cachedQuery);
        }
    }

    window.dispatchEvent(new Event('language-changed'));
  }




 // 强制刷新所有静态文本（独立函数，可在任何时候调用）
function refreshAllStaticText() {
    // 需要特殊保护的ID列表（例如字体选项，避免 textContent 修改破坏其子元素结构）
    var protectedIds = ['theme-font-small', 'theme-font-medium', 'theme-font-large'];
    
    // 处理所有带 data-i18n 属性的元素
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
        // 跳过受保护的ID
        if (protectedIds.includes(el.id)) {
            return;
        }
        var key = el.getAttribute('data-i18n');
        if (key && typeof t === 'function') {
            // 特殊处理：操作菜单按钮保留图标
            var action = el.getAttribute('data-action');
            if (action && key.startsWith('bookmarkOps')) {
                var icons = { export: '📥 ', import: '📤 ', clear: '🗑️ ' };
                el.textContent = (icons[action] || '') + t(key);
            } else {
                el.textContent = t(key);
            }
        }
    });

    // 处理所有带 data-i18n-placeholder 属性的元素
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
        var key = el.getAttribute('data-i18n-placeholder');
        if (key && typeof t === 'function') {
            el.placeholder = t(key);
        }
    });

    // 单独处理字体大小选项，只替换<span>内的文本，不触碰radio和label
    var fontMap = {
        'theme-font-small': 'fontSmall',
        'theme-font-medium': 'fontMedium',
        'theme-font-large': 'fontLarge'
    };
    for (var id in fontMap) {
        var span = document.getElementById(id);
        if (span && typeof t === 'function') {
            // 只修改span的直接文本节点，不影响内部的input
            span.childNodes.forEach(function(node) {
                if (node.nodeType === 3) { // 文本节点
                    node.textContent = t(fontMap[id]);
                }
            });
        }
    }

    // 处理历史搜索框占位符
    var historyInput = document.getElementById('history-search-input');
    if (historyInput) historyInput.placeholder = t('historySearchPlaceholder');

    // 处理设置页标题
    var settingsTitle = document.getElementById('settings-title');
    if (settingsTitle) settingsTitle.textContent = t('settingsTitle');

    // 收藏夹搜索框占位符
    var bookmarkInput = document.getElementById('bookmark-search-input');
    if (bookmarkInput) bookmarkInput.placeholder = t('bookmarkSearchPlaceholder');


  }