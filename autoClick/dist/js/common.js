$(function () {
  // 开关动画
  $(".switch-input").change(function () {
    let switchPa = $(this).parent(".switch-box");
    let isChecked = $(this).is(":checked");
    if (isChecked) {
      switchPa.addClass("open");
    } else {
      switchPa.removeClass("open");
    }
  });
});

// Popup 或 background 向 content 发送消息
function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
        if (chrome.runtime.lastError !== undefined) {
          if (callback) callback(response);
        }
      });
    }
  });
}
