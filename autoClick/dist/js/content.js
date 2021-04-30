let config = {
  autoClick: false,
};

// 读取配置
chrome.storage.sync.get({ autoClick: false }, function (items) {
  console.log("读取", items);
});

// 监听来自 popup 或者 background 的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.cmd == "autoClick") {
    config.autoClick = request.value;
    // 存储配置
    chrome.storage.sync.set({ autoClick: request.value });
  }
});

$(function () {
  // $("a, button").mouseover(function(){
  //   $(this).addClass("highlight-block");
  // });
  // $("a, button").mouseout(function(){
  //   $(this).removeClass("highlight-block");
  // });
});
