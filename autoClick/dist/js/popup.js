let timerList = [];
let canAdd = true;

// 读取配置
chrome.storage.sync.get(
  {
    autoClick: {
      isChecked: false,
      timerList: [],
    },
    loopMode: {
      isChecked: false,
    },
  },
  function (items) {
    if (items) {
      console.log("items", items);
      $(".switch-input").each(function () {
        let value = $(this).val();
        let switchPa = $(this).parent(".switch-box");
        if (value === "autoClick") {
          if (items.autoClick?.isChecked) {
            $(this).attr("checked", "checked");
            switchPa.addClass("open");
          }
          timerList = items.autoClick?.timerList;
          if (timerList.length > 0) {
            renderTimerList();
          } else {
            // 默认生成一个定时器
            addTimer();
          }
        }
        if (value === "loopMode" && items.loopMode?.isChecked) {
          $(this).attr("checked", "checked");
          switchPa.addClass("open");
        }
      });
    }
  }
);

// 监听来自 content 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("popup 收到来自 content 的消息：", request);
});

$(function () {
  // 监听开关
  $(".switch-input").change(function () {
    let value = $(this).val();
    let isChecked = $(this).is(":checked");

    if (value === "autoClick") {
      timerList.forEach((item) => {
        const itemDom = $(`#timer_${item.timerId}`);
        item.target = itemDom.find(".timer-item-target").val();
        item.interval = itemDom.find(".timer-item-interval").val();
      });

      sendMessageToContentScript({
        cmd: value,
        value: {
          isChecked,
          timerList,
        },
      });
    } else {
      $("#autoClick").prop("checked", false);
      sendMessageToContentScript({
        cmd: value,
        value: {
          isChecked,
        },
      });
    }
  });
  // 监听按钮
  $(".add-timer").click(function () {
    if (!canAdd) {
      return;
    }
    canAdd = false;
    addTimer();
    setTimeout(() => {
      canAdd = true;
    }, 1000);
  });
});

function addTimer() {
  console.log("add timer");
  timerList.forEach((item) => {
    const itemDom = $(`#timer_${item.timerId}`);
    item.target = itemDom.find(".timer-item-target").val();
    item.interval = itemDom.find(".timer-item-interval").val();
  });
  timerList.push({
    target: "",
    interval: "",
    timerId: new Date().getTime(),
    timerFun: "",
  });
  console.log("timerList", timerList);
  renderTimerList();
}

function renderTimerList() {
  let domHtml = "";
  timerList.forEach(function (item) {
    domHtml += `<div class="timer-item-wrap" id="timer_${item.timerId}">
    <input type="string" class="timer-item timer-item-target" value="${item.target}" placeholder="输入目标按钮" title="1000ms = 1s" />
    <input type="number" class="timer-item timer-item-interval" value="${item.interval}" placeholder="输入间隔时间，单位ms" title="1000ms = 1s" />
  </div>`;
  });
  $("#timerList").html(domHtml);
}
