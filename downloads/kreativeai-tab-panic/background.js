/* Wrong Droid Tab Panic Button — background service worker
 *
 * The popup does all the heavy lifting. This service worker exists so the
 * extension has a stable lifecycle hook for installs / updates and so we can
 * surface a one-time welcome message.
 */

"use strict";

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("[KreativeAI Tab Panic] Installed. Click the toolbar icon and hit the panic button.");
  } else if (details.reason === "update") {
    console.log("[KreativeAI Tab Panic] Updated to v" + chrome.runtime.getManifest().version);
  }
});
