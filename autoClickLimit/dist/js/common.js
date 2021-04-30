/** popup 或 background 向 content 发送消息 */
function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
        if (chrome.runtime.lastError !== undefined) {
          if (callback) callback(response);
        }
      });
    }
  });
}

/** content 向 popup 或 background 发送消息 */
function sendMessageToExtension(message, callback) {
  chrome.runtime.sendMessage(message, (response) => {
    if (chrome.runtime.lastError !== undefined) {
      if (callback) callback(response);
    }
  });
}

$(() => {});
