const timerList = [];
let canAdd = true;

// 读取配置
chrome.storage.sync.get({ autoClick: false }, function (items) {
  if (items) {
    $(".switch-input").each(function () {
      let value = $(this).val();
      let switchPa = $(this).parent(".switch-box");
      if (value === "autoClick" && items.autoClick) {
        $(this).attr("checked", "checked");
        switchPa.addClass("open");
      }
    });
  }
});

$(function () {
  // 监听开关
  $(".switch-input").change(function () {
    let value = $(this).val();
    let isChecked = $(this).is(":checked");
    if (value === "autoClick") {
      sendMessageToContentScript({ cmd: "autoClick", value: isChecked });
    }
    if (value === "listMode" && isChecked) {
      $(".add-timer").show();
    } else {
      $(".add-timer").hide();
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
      renderTimerList();
    }, 300);
    setTimeout(() => {
      canAdd = true;
    }, 1000);
  });

  // 默认生成一个定时器
  addTimer()
  renderTimerList()
});

function addTimer() {
  console.log("add timer");
  timerList.push({
    target: "",
    interval: "",
    timerId: new Date().getTime(),
  });
  console.log("timerList", timerList);
}

function renderTimerList() {
  let domHtml = "";
  timerList.forEach(function () {
    domHtml += `<div class="timer-item-wrap">
    <input type="number" class="timer-item" placeholder="输入目标按钮" title="1000ms = 1s" />
    <input type="number" class="timer-item" placeholder="输入间隔时间，单位ms" title="1000ms = 1s" />
  </div>`;
  });
  $("#timerList").html(domHtml);
}
