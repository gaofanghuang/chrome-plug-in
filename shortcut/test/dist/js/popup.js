$(function () {
  $('.switch-input').change(function () {
    var value = $(this).val()
    var isChecked = $(this).is(':checked')
    if (value === 'beautyUI') {
      beautyUI(isChecked)
    } else if (value === 'darkUI') {
      darkUI(isChecked)
    } else if (value === 'noImage') {
      noImage(isChecked)
    }
  })
})

function beautyUI(isChecked) {
  console.log('界面美化-开关', isChecked)
}

function darkUI(isChecked) {
  console.log('暗夜模式-开关', isChecked)
  sendMessageToContentScript(
    { cmd: 'darkMode', value: isChecked },
    function (response) {
      console.log('来自content的回复：' + response)
    }
  )
}

function noImage(isChecked) {
  console.log('无图模式-开关', isChecked)
}
