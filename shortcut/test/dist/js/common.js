$(function () {
  // 开关动画
  $('.switch-input').change(function () {
    var switchPa = $(this).parent('.switch-box')
    var isChecked = $(this).is(':checked')
    if (isChecked) {
      switchPa.addClass('open')
    } else {
      switchPa.removeClass('open')
    }
  })
})

// Popup 或 background 向 content 发送消息
function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
      if (callback) callback(response)
    })
  })
}
