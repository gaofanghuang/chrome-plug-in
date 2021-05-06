let config = {
  autoClick: {
    isChecked: false,
    timerList: [],
  },
  loopMode: {
    isChecked: false,
  },
};

let timerList = [];

// 读取配置
chrome.storage.sync.get(
  {
    config: {
      autoClick: {
        isChecked: false,
        timerList: [],
      },
      loopMode: {
        isChecked: false,
      },
    },
  },
  function (items) {
    console.log("读取", items);
  }
);

// 监听来自 popup 或者 background 的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("content 收到来自 popup 或者 background 的消息：", request);
  // 存储配置
  const key = request.cmd;
  const value = request.value;
  config[key] = value;
  chrome.storage.sync.set({ ...config });
  console.log("config", config);
  clearTimer();

  if (key === "autoClick" && value.isChecked) {
    timerList = value.timerList;
    startTimer();
  }
});

$(function () {});

/** 清除全部定时器 */
function clearTimer() {
  if (timerList.length > 0) {
    timerList.forEach((item) => {
      window.clearInterval(item.timerFun);
      window.clearTimeout(item.timerFun);
    });
  }
}

/** 开始定时 */
function startTimer() {
  console.log("startTimer", timerList);
  let delayTime = 0;
  // 补差时间
  let repairTime = 300;

  timerList.forEach((item, index) => {
    if (item.target && item.interval > 0) {
      if (config.loopMode.isChecked) {
        item.timerFun = setInterval(() => {
          $(item.target).click();
        }, item.interval);
      } else {
        delayTime =
          Number(delayTime) + Number(item.interval) + index * repairTime;
        item.timerFun = setTimeout(() => {
          $(item.target).click();
        }, delayTime);
      }
    }
  });
}
