/* Wrong Droid Tab Panic Button — popup.js
 * Pure JS, MV3. No frameworks, no network. All data stays in chrome.storage.local.
 */

"use strict";

// -------------------------------------------------------------------------
// Categorization rules. First match wins.
// Color values must be valid chrome.tabGroups colors:
//   grey | blue | red | yellow | green | pink | purple | cyan | orange
// -------------------------------------------------------------------------
const CATEGORIES = [
  {
    name: "AI Tools",
    color: "purple",
    test: (url) =>
      /(^|\.)(chatgpt\.com|claude\.ai|anthropic\.com|openai\.com|gemini\.google\.com|bard\.google\.com|perplexity\.ai|copilot\.microsoft\.com|poe\.com|character\.ai|huggingface\.co|mistral\.ai|cohere\.com|you\.com)(\/|$)/i.test(
        url
      ),
  },
  {
    name: "Email / Admin",
    color: "yellow",
    test: (url) =>
      /(^|\.)(mail\.google\.com|gmail\.com|outlook\.live\.com|outlook\.office\.com|outlook\.office365\.com|mail\.yahoo\.com|proton\.me|protonmail\.com|fastmail\.com|hey\.com|superhuman\.com)(\/|$)/i.test(
        url
      ),
  },
  {
    name: "Documents",
    color: "blue",
    test: (url) =>
      /(^|\.)(docs\.google\.com|sheets\.google\.com|slides\.google\.com|drive\.google\.com|office\.com|sharepoint\.com|onedrive\.live\.com|notion\.so|dropbox\.com|box\.com|evernote\.com|airtable\.com)(\/|$)/i.test(
        url
      ),
  },
  {
    name: "Coding",
    color: "green",
    test: (url) =>
      /(^|\.)(github\.com|gitlab\.com|bitbucket\.org|stackoverflow\.com|stackexchange\.com|developer\.mozilla\.org|learn\.microsoft\.com|docs\.microsoft\.com|npmjs\.com|pypi\.org|crates\.io|dev\.to|codepen\.io|codesandbox\.io|replit\.com|vercel\.com|netlify\.com)(\/|$)/i.test(
        url
      ),
  },
  {
    name: "Video / Creative Tools",
    color: "pink",
    test: (url) =>
      /(^|\.)(runwayml\.com|klingai\.com|veo\.google\.com|vimeo\.com|youtube\.com|youtu\.be|midjourney\.com|openart\.ai|freepik\.com|magnific\.ai|canva\.com|figma\.com|adobe\.com|behance\.net|dribbble\.com|suno\.com|elevenlabs\.io|leonardo\.ai|krea\.ai|higgsfield\.ai|pika\.art|luma\.ai)(\/|$)/i.test(
        url
      ),
  },
  {
    name: "Social / Publishing",
    color: "orange",
    test: (url) =>
      /(^|\.)(linkedin\.com|x\.com|twitter\.com|instagram\.com|facebook\.com|threads\.net|tiktok\.com|reddit\.com|bsky\.app|pinterest\.com|mastodon\.social|hachyderm\.io|youtube\.com\/(channel|c|@))(\/|$)/i.test(
        url
      ),
  },
  {
    name: "Shopping / Pricing",
    color: "red",
    test: (url) =>
      /(^|\.)(amazon\.[a-z.]+|bestbuy\.com|bhphotovideo\.com|ebay\.com|etsy\.com|walmart\.com|target\.com|newegg\.com|costco\.com|aliexpress\.com|shopify\.com)(\/|$)/i.test(
        url
      ) || /\/(pricing|plans|buy|checkout|cart)(\/|$|\?)/i.test(url),
  },
  {
    name: "Read Later",
    color: "cyan",
    test: (url) =>
      /(^|\.)(getpocket\.com|pocket\.com|instapaper\.com|raindrop\.io|matter\.app|readwise\.io)(\/|$)/i.test(
        url
      ),
  },
  {
    name: "Research",
    color: "grey",
    test: (url, title) =>
      /(^|\.)(wikipedia\.org|arxiv\.org|nature\.com|sciencedirect\.com|scholar\.google\.com|medium\.com|substack\.com|news\.ycombinator\.com|bbc\.com|cnn\.com|reuters\.com|nytimes\.com|theverge\.com|techcrunch\.com|arstechnica\.com|wired\.com|economist\.com)(\/|$)/i.test(
        url
      ) ||
      /\.pdf($|\?)/i.test(url) ||
      /\b(news|article|blog|research)\b/i.test(title || ""),
  },
];

const FALLBACK_CATEGORY = { name: "Needs Review", color: "grey" };

const STORAGE_KEYS = {
  workspaces: "wd_workspaces",
  pinned: "wd_include_pinned",
  lastSummary: "wd_last_summary",
};

// -------------------------------------------------------------------------
// Tiny helpers
// -------------------------------------------------------------------------
const $ = (id) => document.getElementById(id);

const hasChrome = () =>
  typeof chrome !== "undefined" && chrome.tabs && chrome.tabGroups;

function categorize(tab) {
  const url = tab.url || tab.pendingUrl || "";
  const title = tab.title || "";
  for (const cat of CATEGORIES) {
    try {
      if (cat.test(url, title)) return cat;
    } catch (_) {
      /* ignore individual rule errors */
    }
  }
  return FALLBACK_CATEGORY;
}

function nowIsoLocal() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    d.getFullYear() +
    "-" + pad(d.getMonth() + 1) +
    "-" + pad(d.getDate()) +
    " " + pad(d.getHours()) +
    ":" + pad(d.getMinutes())
  );
}

function setStatus(msg, kind /* "ok" | "warn" | "error" | undefined */) {
  const box = $("statusBox");
  const el = $("statusMessage");
  el.className = "status-message" + (kind ? " " + kind : "");
  el.textContent = msg;
  box.classList.remove("hidden");
}

function clearStatus() {
  $("statusBox").classList.add("hidden");
  $("statusMessage").textContent = "";
}

function storageGet(keys) {
  return new Promise((resolve, reject) => {
    if (!hasChrome() || !chrome.storage) return resolve({});
    chrome.storage.local.get(keys, (res) => {
      const err = chrome.runtime && chrome.runtime.lastError;
      if (err) return reject(new Error(err.message));
      resolve(res || {});
    });
  });
}

function storageSet(obj) {
  return new Promise((resolve, reject) => {
    if (!hasChrome() || !chrome.storage)
      return reject(new Error("Storage unavailable in this context"));
    chrome.storage.local.set(obj, () => {
      const err = chrome.runtime && chrome.runtime.lastError;
      if (err) return reject(new Error(err.message));
      resolve();
    });
  });
}

// -------------------------------------------------------------------------
// Tab scanning + group creation
// -------------------------------------------------------------------------
async function getCurrentWindowTabs(includePinned) {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  return includePinned ? tabs : tabs.filter((t) => !t.pinned);
}

async function refreshTabCount() {
  if (!hasChrome()) {
    $("tabCount").textContent = "—";
    setStatus(
      "Preview mode: extension APIs are not available outside Edge. Load the folder as an unpacked extension to use it.",
      "warn"
    );
    return;
  }
  try {
    const includePinned = $("includePinned").checked;
    const tabs = await getCurrentWindowTabs(includePinned);
    $("tabCount").textContent = String(tabs.length);
  } catch (e) {
    $("tabCount").textContent = "—";
    setStatus("Could not read tabs: " + e.message, "error");
  }
}

async function cleanTabs() {
  clearStatus();
  if (!hasChrome()) {
    setStatus(
      "Extension APIs not available. Open this from the Edge toolbar after loading it as an unpacked extension.",
      "error"
    );
    return;
  }

  const cleanBtn = $("cleanBtn");
  cleanBtn.disabled = true;

  try {
    const includePinned = $("includePinned").checked;
    const tabs = await getCurrentWindowTabs(includePinned);

    if (!tabs.length) {
      setStatus(
        "No tabs to organize in this window. Open a few sites first, then try again.",
        "warn"
      );
      renderResults([]);
      return;
    }

    // Bucket tabs by category
    const buckets = new Map(); // name -> { color, tabs: [] }
    for (const tab of tabs) {
      const cat = categorize(tab);
      if (!buckets.has(cat.name)) buckets.set(cat.name, { color: cat.color, tabs: [] });
      buckets.get(cat.name).tabs.push(tab);
    }

    // Create / update groups
    const created = [];
    let groupingErrors = 0;
    const windowId = tabs[0].windowId;

    for (const [name, bucket] of buckets) {
      const tabIds = bucket.tabs.map((t) => t.id);
      try {
        const groupId = await chrome.tabs.group({
          tabIds,
          createProperties: { windowId },
        });
        try {
          await chrome.tabGroups.update(groupId, {
            title: name,
            color: bucket.color,
            collapsed: false,
          });
        } catch (e) {
          // Some Edge builds reject certain color names — fall back to grey
          try {
            await chrome.tabGroups.update(groupId, { title: name, color: "grey" });
          } catch (_) {
            /* leave un-named */
          }
        }
        created.push({ name, color: bucket.color, count: tabIds.length });
      } catch (e) {
        groupingErrors++;
        console.error("Group failed for", name, e);
      }
    }

    renderResults(created);

    const totalGrouped = created.reduce((s, g) => s + g.count, 0);
    $("resultsTotal").textContent =
      `Organized ${totalGrouped} tab${totalGrouped === 1 ? "" : "s"} into ${created.length} group${created.length === 1 ? "" : "s"}.`;

    if (groupingErrors) {
      setStatus(
        `Grouped most tabs, but ${groupingErrors} group${groupingErrors === 1 ? "" : "s"} could not be created. Check that no browser policy is blocking tab grouping.`,
        "warn"
      );
    } else {
      setStatus("Done. Tabs are grouped and ready.", "ok");
    }

    // Build + store summary
    const summary = buildSummary({
      workspaceName: $("workspaceName").value.trim() || "(unsaved)",
      buckets,
    });
    $("summaryText").value = summary;
    try {
      await storageSet({ [STORAGE_KEYS.lastSummary]: summary });
    } catch (_) {
      /* non-fatal */
    }
  } catch (e) {
    console.error(e);
    setStatus("Something went wrong while organizing tabs: " + e.message, "error");
  } finally {
    cleanBtn.disabled = false;
  }
}

function renderResults(groups) {
  const list = $("resultsList");
  list.innerHTML = "";
  if (!groups.length) {
    $("resultsBox").classList.add("hidden");
    return;
  }
  $("resultsBox").classList.remove("hidden");
  for (const g of groups) {
    const li = document.createElement("li");
    const dot = document.createElement("span");
    dot.className = "dot " + g.color;
    const name = document.createElement("span");
    name.className = "name";
    name.textContent = g.name;
    const count = document.createElement("span");
    count.className = "count";
    count.textContent = g.count + " tab" + (g.count === 1 ? "" : "s");
    li.appendChild(dot);
    li.appendChild(name);
    li.appendChild(count);
    list.appendChild(li);
  }
}

// -------------------------------------------------------------------------
// Summary
// -------------------------------------------------------------------------
function buildSummary({ workspaceName, buckets }) {
  const lines = [];
  lines.push("KREATIVEAI TAB PANIC SUMMARY");
  lines.push("Workspace: " + workspaceName);
  lines.push("Date: " + nowIsoLocal());
  lines.push("");

  // Preserve a sensible category order
  const order = CATEGORIES.map((c) => c.name).concat([FALLBACK_CATEGORY.name]);
  const sortedNames = [...buckets.keys()].sort(
    (a, b) => order.indexOf(a) - order.indexOf(b)
  );

  for (const name of sortedNames) {
    const bucket = buckets.get(name);
    lines.push(name + ":");
    for (const tab of bucket.tabs) {
      const title = (tab.title || "Untitled").replace(/\s+/g, " ").trim();
      const url = tab.url || tab.pendingUrl || "";
      lines.push("- " + title + " — " + url);
    }
    lines.push("");
  }

  lines.push("Action Items:");
  lines.push("- Review the research tabs.");
  lines.push("- Continue work in the saved workspace.");
  lines.push("- Close anything in Needs Review if it is not useful.");
  return lines.join("\n");
}

async function copySummary() {
  const text = $("summaryText").value;
  if (!text.trim()) {
    setStatus("Nothing to copy yet — click Clean My Tabs first.", "warn");
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    setStatus("Summary copied to clipboard.", "ok");
  } catch (e) {
    // Fallback: select the textarea so the user can hit Ctrl+C
    $("summaryText").focus();
    $("summaryText").select();
    setStatus(
      "Clipboard write blocked. The summary is selected — press Ctrl+C to copy.",
      "warn"
    );
  }
}

// -------------------------------------------------------------------------
// Workspaces (save / restore / clear)
// -------------------------------------------------------------------------
async function saveWorkspace() {
  clearStatus();
  if (!hasChrome()) {
    setStatus("Extension APIs not available in this context.", "error");
    return;
  }
  try {
    const includePinned = $("includePinned").checked;
    const tabs = await getCurrentWindowTabs(includePinned);
    if (!tabs.length) {
      setStatus("No tabs to save in this window.", "warn");
      return;
    }

    const nameInput = $("workspaceName").value.trim();
    const fallbackName = "Workspace - " + nowIsoLocal();
    const name = nameInput || fallbackName;

    const entries = tabs.map((t) => ({
      title: t.title || "",
      url: t.url || t.pendingUrl || "",
      category: categorize(t).name,
      pinned: !!t.pinned,
    }));

    const workspace = {
      id: "ws_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
      name,
      date: new Date().toISOString(),
      tabs: entries,
    };

    const { [STORAGE_KEYS.workspaces]: existing = [] } = await storageGet(
      STORAGE_KEYS.workspaces
    );
    const updated = [workspace, ...existing].slice(0, 50); // cap at 50
    await storageSet({ [STORAGE_KEYS.workspaces]: updated });

    setStatus(
      "Saved \"" + name + "\" with " + entries.length + " tab" + (entries.length === 1 ? "" : "s") + ".",
      "ok"
    );
    $("workspaceName").value = "";
    await populateWorkspaceDropdown(workspace.id);
  } catch (e) {
    console.error(e);
    setStatus("Could not save workspace: " + e.message, "error");
  }
}

async function populateWorkspaceDropdown(selectedId) {
  const select = $("workspaceSelect");
  select.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "— Saved workspaces —";
  select.appendChild(placeholder);

  const { [STORAGE_KEYS.workspaces]: workspaces = [] } = await storageGet(
    STORAGE_KEYS.workspaces
  );
  for (const ws of workspaces) {
    const opt = document.createElement("option");
    opt.value = ws.id;
    const when = ws.date ? new Date(ws.date) : null;
    const stamp = when
      ? when.toLocaleDateString() + " " + when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "";
    opt.textContent = ws.name + "  (" + ws.tabs.length + " tabs" + (stamp ? ", " + stamp : "") + ")";
    if (selectedId && ws.id === selectedId) opt.selected = true;
    select.appendChild(opt);
  }
  $("restoreBtn").disabled = workspaces.length === 0;
}

async function restoreWorkspace() {
  clearStatus();
  if (!hasChrome()) {
    setStatus("Extension APIs not available in this context.", "error");
    return;
  }
  const id = $("workspaceSelect").value;
  if (!id) {
    setStatus("Pick a saved workspace from the dropdown first.", "warn");
    return;
  }
  try {
    const { [STORAGE_KEYS.workspaces]: workspaces = [] } = await storageGet(
      STORAGE_KEYS.workspaces
    );
    const ws = workspaces.find((w) => w.id === id);
    if (!ws) {
      setStatus("That workspace could not be found.", "error");
      return;
    }
    const urls = ws.tabs.map((t) => t.url).filter(Boolean);
    if (!urls.length) {
      setStatus("This workspace has no usable URLs.", "warn");
      return;
    }
    await chrome.windows.create({ url: urls, focused: true });
    setStatus(
      "Opened \"" + ws.name + "\" in a new window (" + urls.length + " tabs).",
      "ok"
    );
  } catch (e) {
    console.error(e);
    setStatus("Could not restore workspace: " + e.message, "error");
  }
}

// Two-step clear: first click arms the confirm state, second click wipes.
let clearArmed = false;
let clearTimer = null;
async function handleClearClick() {
  const btn = $("clearBtn");
  if (!clearArmed) {
    clearArmed = true;
    btn.classList.add("confirm");
    btn.textContent = "Click again to confirm — wipes all saved workspaces";
    clearTimer = setTimeout(resetClearButton, 4000);
    return;
  }
  resetClearButton();
  try {
    await storageSet({ [STORAGE_KEYS.workspaces]: [] });
    await populateWorkspaceDropdown();
    setStatus("All saved workspaces cleared.", "ok");
  } catch (e) {
    setStatus("Could not clear storage: " + e.message, "error");
  }
}
function resetClearButton() {
  if (clearTimer) clearTimeout(clearTimer);
  clearTimer = null;
  clearArmed = false;
  const btn = $("clearBtn");
  btn.classList.remove("confirm");
  btn.textContent = "Clear Saved Workspaces";
}

// -------------------------------------------------------------------------
// Init
// -------------------------------------------------------------------------
async function init() {
  // Load persisted UI state
  try {
    const { [STORAGE_KEYS.pinned]: includePinned, [STORAGE_KEYS.lastSummary]: lastSummary } =
      await storageGet([STORAGE_KEYS.pinned, STORAGE_KEYS.lastSummary]);
    $("includePinned").checked = !!includePinned;
    if (lastSummary) $("summaryText").value = lastSummary;
  } catch (_) { /* ignore */ }

  await refreshTabCount();
  await populateWorkspaceDropdown();

  $("includePinned").addEventListener("change", async (e) => {
    try { await storageSet({ [STORAGE_KEYS.pinned]: e.target.checked }); } catch (_) {}
    refreshTabCount();
  });

  $("cleanBtn").addEventListener("click", cleanTabs);
  $("saveBtn").addEventListener("click", saveWorkspace);
  $("restoreBtn").addEventListener("click", restoreWorkspace);
  $("copyBtn").addEventListener("click", copySummary);
  $("clearBtn").addEventListener("click", handleClearClick);
}

document.addEventListener("DOMContentLoaded", init);
