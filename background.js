
const TOGGLE = { type: "awesome-gebra:toggle" };

async function toggle(tab) {
  if (!tab || !tab.id) return;
  try {
    await chrome.tabs.sendMessage(tab.id, TOGGLE);
  } catch (e) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: false },
        files: ["content.js"]
      });
      await chrome.tabs.sendMessage(tab.id, TOGGLE);
    } catch (err) {
      console.warn("AWeSome Gebra cannot run on this page:", err.message);
    }
  }
}

chrome.action.onClicked.addListener(toggle);

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "toggle-overlay") return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  toggle(tab);
});

function safeFolder(name) {
  const cleaned = String(name || "")
    .replace(/[\\/]+/g, "/")
    .split("/")
    .map((part) => part.replace(/[<>:"|?*\x00-\x1f]/g, "").replace(/^\.+$/, "").trim())
    .filter(Boolean)
    .join("/");
  return cleaned;
}

chrome.runtime.onMessage.addListener((msg, sender, respond) => {
  if (!msg || msg.type !== "awesome-gebra:save") return;
  const folder = safeFolder(msg.folder);
  const filename = folder ? `${folder}/${msg.filename}` : msg.filename;
  chrome.downloads.download({ url: msg.url, filename, saveAs: false }, (id) => {
    respond({ ok: !chrome.runtime.lastError, id, error: chrome.runtime.lastError?.message });
  });
  return true;
});
