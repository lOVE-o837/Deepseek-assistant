# Privacy Policy

**Last updated: 2026-06-29**

## Data Collection

The DeepSeek Assistant extension **does not collect, store, or transmit any personal user data**.

## Anonymous Usage Statistics (v1.4.3+)

Starting with version 1.4.3, the extension collects **completely anonymous** usage data to help improve the product. This includes:

- **Feature usage frequency**: e.g., how many times "History Search" or "Bookmark Conversation" is used
- **Platform information**: browser type (Edge or Chrome), operating system language, extension version
- **Anonymous session identifier**: a randomly generated temporary identifier that cannot be linked to any individual

**We do NOT collect:**
- ❌ Search keywords
- ❌ Conversation titles or content
- ❌ Bookmarked content
- ❌ Any personally identifiable information (name, email, IP address, etc.)

All usage data is transmitted over HTTPS to Cloudflare Workers and is used solely for analyzing feature usage trends and improving the extension. Data is not shared with any third party.

## Local Storage

All user data — including bookmarked conversations, bookmarked messages, folders, theme preferences, and language settings — is stored entirely in the browser's local storage (`chrome.storage.local`). Data is kept fully offline and never passes through any remote server.

## Data Sharing

Since this extension does not collect any personal data, and anonymous usage data is only used for product improvement, there is no sharing of personal data with third parties.

## Permission Usage

The permissions requested by this extension are used solely to deliver core functionality:
- `storage`: Local data persistence
- `activeTab`: Detect whether the current page is a DeepSeek page
- `scripting`: Inject the feature panel and floating button
- `alarms`: Keep the background service alive
- Host permission (`chat.deepseek.com`): Run exclusively on DeepSeek pages

None of these permissions are used to collect personal data.

## Contact

For any privacy-related questions, please file an issue on GitHub:
https://github.com/lOVE-o837/Deepseek-assistant/issues
