# KreativeAI Tab Panic Button

**Turn browser chaos into a project plan.**

A Microsoft Edge / Chromium extension from **Kreative**AI that organizes every open tab in the current window into clean, color-coded browser tab groups — in one click. All data stays local on your device.

> *Too many tabs open? Hit the panic button.*

---

## Features

- One big **Clean My Tabs** button — scans the current window, categorizes every tab, and creates real browser tab groups.
- Pure rule-based categorization (no AI, no network calls). Ten categories:
  AI Tools · Research · Video / Creative Tools · Documents · Coding · Social / Publishing · Email / Admin · Shopping / Pricing · Read Later · Needs Review.
- **Save Workspace** — snapshots every tab (title, URL, category, timestamp) to local storage. Up to 50 saved workspaces.
- **Restore Workspace** — picks a saved workspace from a dropdown and reopens it in a new window.
- **Copy Summary** — generates a plain-text project summary of all grouped tabs, ready to paste into a doc, ticket, or email.
- **Clear Saved Workspaces** — two-click confirmation, no accidental wipes.
- Optional **Include pinned tabs** checkbox (off by default — pinned tabs are left alone).
- Light, brand-aligned UI: white + KreativeAI blue (`#0b63f6`) on Inter typography.
- Manifest V3. No frameworks. No build tools. No host permissions.

---

## Folder structure

```
kreativeai-tab-panic/    (folder name on disk can be anything — the loaded extension is "KreativeAI Tab Panic Button")
├── manifest.json
├── popup.html
├── popup.css
├── popup.js
├── background.js
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

---

## Install (Microsoft Edge)

1. Open `edge://extensions` in Edge.
2. Toggle **Developer mode** on (bottom-left corner).
3. Click **Load unpacked**.
4. Select the extension folder (the one with `manifest.json` in it).
5. The extension icon (white **K** on a KreativeAI-blue gradient) appears in the Edge toolbar. Pin it for quick access.

It also works in Chrome / Brave / Arc: open `chrome://extensions`, enable Developer mode, Load unpacked, select the folder.

---

## Test plan

1. Open 10–20 tabs spread across these kinds of sites:
   - AI: `chatgpt.com`, `claude.ai`, `gemini.google.com`
   - Docs: `docs.google.com`, `notion.so`
   - Coding: `github.com`, `stackoverflow.com`, `developer.mozilla.org`
   - Video / Creative: `youtube.com`, `figma.com`, `runwayml.com`
   - Email: `mail.google.com`, `outlook.live.com`
   - Social: `linkedin.com`, `x.com`, `reddit.com`
   - Shopping: `amazon.com`, `bestbuy.com`
   - News / Research: a Wikipedia page, a news article, a PDF
2. Click the **KreativeAI Tab Panic Button** icon in the toolbar.
3. Confirm the scanned tab count matches what's in your window.
4. Click **Clean My Tabs**.
   - Tabs should reorder and collapse into named, color-coded groups.
   - The Results section lists every group and how many tabs landed in it.
   - The Project Summary panel fills with plain text.
5. Type a name like "Friday research" into the Workspace input, then click **Save**.
6. Click **Copy Summary** — paste it into a text editor to verify it's clean plain text.
7. Pick your saved workspace from the dropdown and click **Restore** — a new Edge window opens with the same tabs.
8. Click **Clear Saved Workspaces** twice — the dropdown empties.

### Edge cases worth checking

- **Pinned tabs**: by default they're skipped. Enable the "Include pinned tabs" checkbox to include them. Pinned status survives in saved workspaces.
- **Already-grouped tabs**: re-running Clean My Tabs regroups them according to current categorization.
- **No tabs / blank window**: the popup shows a clear "No tabs to organize" message rather than failing silently.
- **One-of-a-kind URLs** (intranet, localhost, file://): they fall into **Needs Review**.

---

## Permissions explained

| Permission | Why |
|---|---|
| `tabs` | Read the title and URL of tabs in the current window so they can be categorized. |
| `tabGroups` | Create, rename, and color real browser tab groups. |
| `storage` | Save workspaces and your "include pinned" preference to `chrome.storage.local`. |

No host permissions. No `<all_urls>`. No network requests. Nothing leaves your browser.

---

## How categorization works

Rules live in `popup.js` (`CATEGORIES` array) and are applied in order. Each rule is a regex test against the tab's URL (and, for a couple of rules, the title). The first matching rule wins. Anything that matches no rule goes to **Needs Review** so you can decide what to do with it.

To add a domain to a category, edit `popup.js`, find the relevant `CATEGORIES` entry, and add it to the regex. No build step needed — just reload the extension at `edge://extensions`.

---

## Troubleshooting

- **Nothing happens when I click Clean My Tabs.** Open the popup, right-click → Inspect, check the Console panel for errors. The most common cause is enterprise / school policy blocking the `tabGroups` API.
- **"Storage unavailable"**: make sure the extension is loaded from the unpacked folder, not opened as a plain HTML file.
- **Icons missing**: re-run the install steps; the `icons/` folder needs to ship with the extension.
- **Group colors look off**: Edge supports the same nine group colors as Chrome (`grey`, `blue`, `red`, `yellow`, `green`, `pink`, `purple`, `cyan`, `orange`). Anything else falls back to grey.

---

## License

Use it, ship it, modify it. No warranty.
