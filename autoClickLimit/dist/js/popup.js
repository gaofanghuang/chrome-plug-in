/** 能否点击按钮，限制过快点击 */
let canPlay = true;

/** 当前状态: "已停止" | "运行中" */
let state = false;

/**
 * ---------------------------------------------------------
 */

// 读取配置
chrome.storage.sync.get({ state: false }, (items) => {
  if (items) {
    console.log("popup load items", items);
    initPopup(items.state);
  }
});

// 监听来自 content 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("popup 收到来自 content 的消息：", request);
  if (request.cmd == "changeProcess") {
    loadProcess(request.value)
  }
});

$(() => {
  // 监听开关按钮
  $("#playBtn").click(() => {
    if (!canPlay) {
      return;
    }
    canPlay = false;
    state = !state;

    setTimeout(() => {
      // 广播 【切换状态】 事件
      sendMessageToContentScript({ cmd: "toggleState", value: state });

      initPopup(state);
    }, 300);

    setTimeout(() => {
      canPlay = true;
    }, 1000);
  });
});

function initPopup(state) {
  $("#stateLabel").text(state ? "运行中" : "已停止");
  $("#playBtn").text(state ? "停止" : "开始");
}

function loadProcess({ curIndex = 0, totalCount = 0 }) {
  $("#stateValue").text(`${curIndex + 1}/${totalCount}`);
}
