/** 定时器*/
let autoClickTimer;

/** 当前状态: "已停止" | "运行中" */
let state = false;

/** 当前进度
 * @param curIndex 当前第几个项目
 * @param totalCount 总项目数
 */
const process = {
  curIndex: 0,
  totalCount: 0,
};

/**
 * ---------------------------------------------------------
 */

// 读取配置
chrome.storage.sync.get({ state: false }, (items) => {
  console.log("content load items", items);
});

// 监听来自 popup 或者 background 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("content 收到来自 popup 或者 background 的消息：", request);
  if (request.cmd == "toggleState") {
    state = request.value;
    // 存储配置
    chrome.storage.sync.set({ state: request.value });
    if (request.value) {
      playTimer();
    } else {
      stopTimer();
    }
  }
});

$(() => {});

/**
 * ---------------------------------------------------------
 */

/** 开启计时器 */
function playTimer() {
  process.totalCount = $("#left_side li").length;
  process.curIndex = $("#left_side li.cloud").index();
  // 广播 【进度】 事件
  sendMessageToExtension({ cmd: "changeProcess", value: process });
  // stopTimer();
  setTimeout(() => {
    initTimer();
  }, 600);
}

/** 停止计时器 */
function stopTimer() {
  // ClearTimer
  clearInterval(autoClickTimer);
}

/** 获取页面中的项目列表 */
function initTimer() {
  // 初始化Timer
  // 当前播放项目总时间
  const timeDom = $("#left_side li.cloud")
    .find(".tags")
    .text();
  const rule = /\&nbsp;*?\//g;
  const time = timeDom.match(rule) ? timeDom.match(rule)[0] : '';
  // 当前播放项目时间点
  const curTime = $("#left_side li.cloud .tags .playTime").text();

  sendMessageToExtension({ cmd: "getTime", value: { time, curTime } });
}
