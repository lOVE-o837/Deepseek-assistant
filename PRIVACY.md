# Privacy Policy

**Last updated: November 14, 2026**

DeepSeek Assistant ("the Extension") is an independently developed browser extension that helps users find, organize, save, and reuse information from supported AI conversations. This Privacy Policy explains how information is stored and processed when you use the Extension.

## 1. Information Stored in Your Browser

The Extension stores information needed for its features in your browser's local storage. This may include saved conversations and messages, bookmarks, folders, prompt templates, preferences, and extension settings.

You can manage supported saved items through the Extension's interface and use its backup, import, and export features. Data you choose to export or back up is handled as part of the action you initiate.

## 2. Limited Usage Analytics

We use limited feature-use analytics to understand and improve the Extension. Different versions use different analytics systems.

### Legacy analytics

Older versions send individual feature or action categories, browser type, browser language, extension version and event time over HTTPS to a Cloudflare Worker. The legacy service processes the connection IP address for daily, per-feature deduplication. Older installations that have not updated may continue to use the legacy endpoint. The legacy event body does not contain a persistent user ID, search queries, conversation text, saved prompts, bookmarked content, names, email addresses or AI account details.

### V2 aggregated analytics in a later extension version

The V2 behavior described below is intended for a later extension version; deployment of the server does not mean that a V2 client has been published in any store.

On Chrome, when no V2 setting exists, V2 statistics run in the background by default without a separate in-extension consent prompt. You can turn statistics off in settings. An existing V2 setting that has been turned off is preserved. On Edge and other browsers, V2 does not turn on automatically by default.

V2 measures only implemented entry points, so these counts do not represent every use of a feature. The seven event families are `search_applied`, `content_open_requested`, `bookmark_created`, `prompt_reused`, `export_requested`, `organization_committed` and `survey_open_requested`. Opening a survey does not mean it was submitted.

V2 sends only finite event and event-specific classification values, a coarse browser category, a UTC date and locally aggregated counts. It does not send conversation text, search terms, prompt text, filenames, account or installation identifiers, page URLs, cookies, tokens, precise event times or full user-agent strings. A network provider can still see the connection IP; we do not claim a particular retention period for Cloudflare security or access logs.

V2 sends data via HTTPS to Cloudflare Workers, which writes aggregate data points to Cloudflare Analytics Engine. The client buffers at most 24 groups, each capped at 200 counts, and reserves at most three batches per UTC day; each batch contains at most eight groups and is at most 2,048 bytes. Excess or expired counts may be dropped. Turning statistics off stops new collection and sends and clears unsent groups. A request already in flight cannot always be recalled. An uncertain result is not automatically resent, so counts may be incomplete.

V2 counts are partial feature-use aggregates, not user counts or proof that a page loaded, a file was saved, or a survey was submitted.

## 3. How Information Is Used and Shared

Information saved for the Extension's features is primarily stored in your browser. The usage analytics described above do not transmit your saved conversation content, bookmarked text, search terms, or saved prompt text to our analytics service.

Cloudflare provides infrastructure for receiving and processing usage events and storing aggregate statistics. We do not sell usage analytics data.

The Extension may interact with supported AI websites to provide its features. Your use of those websites remains subject to their own terms and privacy policies.

## 4. Website Access and Browser Permissions

The Extension uses browser permissions to store local information, recognize supported tabs, provide its interface and page features, and support background operation.

The primary supported website is `chat.deepseek.com`, where the Extension provides conversation search, navigation, bookmarking, and prompt insertion.

The Extension also requests access to `claude.ai`, `chatgpt.com`, and `gemini.google.com` for limited experimental conversation-history and panel compatibility features. These features are under development and may be incomplete or unavailable.

## 5. Feedback and External Services

Selecting the feedback option in the Extension opens a language-specific form hosted by Tally. Submitting feedback is optional. Information you enter into that form is handled by the form provider under its applicable privacy terms.

You may also submit feedback through GitHub Issues. When you open these external services, their respective privacy policies apply.

Usage analytics may record that a feedback form was requested, but do not include the text of feedback you submit.

## 6. Your Choices and Contact

You can manage supported bookmarks, prompts, and settings within the Extension and export or remove supported saved items using the available features. You can also remove the Extension through your browser. The handling of remaining browser data depends on your browser's storage and removal behavior.

For questions about this policy or requests concerning information processed by the Extension, please contact us through a feedback channel below.

- **Feedback (English):** https://tally.so/r/pbzBEB
- **反馈（中文）：** https://tally.so/r/VLN0jE
- **GitHub Issues:** https://github.com/lOVE-o837/Deepseek-assistant/issues

## 7. Changes to This Policy

We may update this Privacy Policy when the Extension's features or data practices change. The updated policy will indicate its latest revision date.
