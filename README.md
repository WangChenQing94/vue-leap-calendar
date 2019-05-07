# vue-leap-calendar

一个排期日历插件

## 安装
```shell
npm install --save vue-leap-calendar
```

## 导入
```js
import leapCalendar from 'vue-leap-calendar';
Vue.use(leapCalendar)
```

## 使用
```js
<template>
  <leapCalendar></leapCalendar>
</template>
```
## 配置
```js
// 日程数据
// data: {'2019-1-1': '日程内容', '2019-1-2': '日程内容'}
data: {}
// 样式类(样式)
calendarClass: {
  schedule: '', // 日程样式
  otherMonth: '', // 不是本月日期
  curDay: 'col-red', // 今天样式
  btnPrev: '',
  btnToday: '',
  btnNext: ''
}
// 日历文本(默认文本)
calendarText: {
  btnPrev: '上月',
  btnToday: '今天',
  btnNext: '下月',
  year: '年',
  month: '月',
  day: '日',
  weeks: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
}
```