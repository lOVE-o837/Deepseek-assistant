# Privacy Policy

**Last updated: 2026-09-23**

## Data Collection

DeepSeek Assistant does not collect or transmit personally identifiable user data to developer-operated servers.

## Anonymous Usage Statistics

The extension collects limited anonymous usage statistics to help improve the product.

This may include:

- Feature usage frequency
- Browser type (Chrome or Edge)
- Operating system language
- Extension version
- An anonymous session identifier that cannot be used to identify an individual

We do NOT collect or transmit:

- Search keywords
- Conversation titles or conversation content
- Bookmarked content
- Personally identifiable information such as name or email address

Anonymous usage statistics are transmitted over HTTPS to Cloudflare Workers and are used only for product improvement and aggregate usage analysis.

## Local Storage

Extension-managed user content — including bookmarked conversations, bookmarked messages, folders, theme preferences, and language settings — is stored locally in the browser using `chrome.storage.local`.

Saved conversations, bookmarked content, search keywords, and other locally stored extension content are not transmitted to developer-operated servers.

Anonymous usage statistics are handled separately as described above.

## Data Sharing

DeepSeek Assistant does not sell user data.

Anonymous usage statistics are used only for product improvement and are not shared with third parties except as necessary to operate the telemetry infrastructure described above.

## Permission Usage

The permissions requested by this extension are used solely to provide its core functionality:

- `storage`: Store extension-managed user data locally
- `activeTab`: Detect whether the active tab is a DeepSeek page
- `scripting`: Inject the feature panel and floating button
- `alarms`: Support background Service Worker reliability
- `tabs`: Detect page refreshes and DeepSeek SPA navigation
- Host permission (`chat.deepseek.com`): Run DeepSeek-specific features on DeepSeek pages

These permissions are not used to collect personally identifiable information.

## Contact

For privacy-related questions, please file an issue on GitHub:
https://github.com/lOVE-o837/Deepseek-assistant/issues