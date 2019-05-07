<template lang="pug">
  .calendar
    .calendar-title
      p.font-18 {{curYear}}{{calendarText.year}}&nbsp;&nbsp;{{curMonth}}{{calendarText.month}}
      div.btn-group
        span.btn.btn-prev(@click="onPrev" :class="[calendarClass.btnPrev]") {{calendarText.btnPrev}}
        span.btn.btn-today(@click="init" :class="[calendarClass.btnToday]") {{calendarText.btnToday}}
        span.btn.btn-next(@click="onNext" :class="[calendarClass.btnNext]") {{calendarText.btnNext}}

    header.calender-header.calendar-row
      span.text-right(v-for="(week, i) in calendarText.weeks" :key="i") {{week}}
    ul.calendar-row.calender-date
      li(v-for="(day, i) in days" :key="i"
                    :class="[day.type === 'current' ? '' : 'col-gray ' + calendarClass.otherMonth, ]")
        p.clear
          span.lunar-calendar {{day.lunar.IDayCn === '初一' ? day.lunar.IMonthCn : ''}}{{day.lunar.IDayCn}}
          span.solar-calendar.fr(:class="[day.activeColor]") {{day.value}}{{calendarText.day}}
        div.text-center.font-16.mt-10(v-if="day.schedule" :class="[calendarClass.schedule]") {{day.schedule}}
</template>

<script>
import calendar from './calendar.js';

export default {
  name: 'leapCalendar',
  props: {
    // 日程数据
    /**
      data: {'2019-1-1': '日程', '2019-1-2': '日程'}
     */
    data: {
      type: Object,
      default () {
        return {}
      }
    },
    // 日程Dom样式
    calendarClass: {
      type: Object,
      default () {
        return {
          schedule: '', // 日程样式类
          otherMonth: '', // 其他月份日历的样式类
          curDay: 'col-red', // 今天的样式类
          btnPrev: '',
          btnToday: '',
          btnNext: ''
        }
      }
    },
    calendarText: {
      type: Object,
      default () {
        return {
          btnPrev: '上月',
          btnToday: '今天',
          btnNext: '下月',
          year: '年',
          month: '月',
          day: '日',
          weeks: ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        }
      }
    },
  },
  data () {
    return {
      realMonth: '',
      curMonth: '',
      curYear: '',
      curDay: '',
      days: []
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化 当月当天日历
    init () {
      const curYear = new Date().getFullYear();
      const curMonth = new Date().getMonth() + 1;
      this.realMonth = curMonth;
      this.curMonth = curMonth;
      this.curYear = curYear;
      this.showCurMonth(curYear, curMonth);
    },
    // 判断是否是闰年
    judgeLeapYear (year) {
      return (year % 400 === 0) || ((year % 4 === 0) && (year % 100 !== 0))
    },
    // 处理每月的天数
    handleMonthWithDay (year, month) {
      const isLeapYear = this.judgeLeapYear(year);
      switch (Number(month)) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
          return 31
        case 2:
          return isLeapYear ? 29 : 28;
        case 4:
        case 6:
        case 9:
        case 10:
        case 11:
          return 30
      }
    },
    // 是否是十二月 或者 一月
    handleDecemberOrJanuary (type) {
      let curMonth = Number(this.curMonth);
      let curYear = Number(this.curYear);
      if (curMonth === 1 && type === 'prev') {
        curYear = curYear - 1;
        curMonth = 12;
      } else if (curMonth === 12 && type === 'next') {
        curYear = curYear + 1;
        curMonth = 1;
      } else if (type === 'prev') {
        curMonth = curMonth - 1;
      } else if (type === 'next') {
        curMonth = curMonth + 1;
      }
      this.showCurMonth(curYear, curMonth)
    },
    // 显示当月需要显示的天数
    showCurMonth (year, month) {
      const dates = this.handleMonthWithDay(year, month);
      const firstDayOfWeek = this.handleDayOfWeek(`${year}-${month}-01`, true);
      const prevMonthDatas = this.handleMonthWithDay(month === 1 ? year - 1: year, month === 1 ? 12 : month - 1);
    
      let days = [];
      for (let i = 1; i <= dates; i++) {
        const day = {
          value: i,
          type: 'current',
          time: `${year}-${month}-${i}`,
          lunar: calendar.solar2lunar(year, month, i)
        }
        if (this.realMonth === month) {
          if (new Date().getDate() === i) {
            day['activeColor'] = this.calendarClass.curDay
          }
        }
        days.push(day);
      }

      for (let i = 0; i < firstDayOfWeek; i++) {
        days.unshift({
          value: prevMonthDatas - i,
          type: 'prev',
          time: `${month === 1 ? year - 1: year}-${month === 1 ? 12 : month - 1}-${prevMonthDatas - i}`,
          lunar: calendar.solar2lunar(month === 1 ? year - 1: year, month === 1 ? 12 : month - 1, prevMonthDatas - i)
        });
      }

      const lastDayOfWeek = 42 - days.length;
      for (let i = 1; i <= lastDayOfWeek; i++) {
        days.push({
          value: i,
          type: 'next',
          time: `${month === 12 ? year + 1 : year}-${month === 12 ? 1 : month + 1}-${i}`,
          lunar: calendar.solar2lunar(month === 12 ? year + 1 : year, month === 12 ? 1 : month + 1, i)
        });
      }

      console.log(days);
      this.curYear = year;
      this.curMonth = month;
      this.days = days;
      this.handleSchedule()
    },
    // 根据一号的星期数返回距离周一还有几天
    handleDayOfWeek (time, isFirst) {
      const week = new Date(time).getDay();
      switch (week) {
        // 周日
        case 0:
          return isFirst ? 0 : 6;
        // 周一
        case 1:
          return isFirst ? 1 : 5;
        // 周二
        case 2:
          return isFirst ? 2 : 4;
        // 周三
        case 3:
          return isFirst ? 3 : 3;
        // 周四
        case 4:
          return isFirst ? 4 : 2;
        // 周五
        case 5:
          return isFirst ? 5 : 1;
        // 周六
        case 6:
          return isFirst ? 6 : 0;
      }
    },
    // 处理日程
    handleSchedule () {
      this.days = this.days.map(item => {
        item['schedule'] = this.data[item.time]
        return item
      })
    },
    // Props 函数
    onPrev () {
      this.handleDecemberOrJanuary('prev');
    },
    onNext () {
      this.handleDecemberOrJanuary('next');
    }
  }
}
</script>

<style scope lang="less">
* {
  padding: 0;
  margin: 0;
}
body {
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: #333;
  background-color: #f0f0f0;
  ul {
    list-style: none;
    padding: 0;
  }

  .calendar {
    background: #fff;
    width: 100%;

    .text-center {
      text-align: center;
    }
    .text-right {
      text-align: right;
    }
    .font-16 {
      font-size: 16px;
    }
    .font-18 {
      font-size: 18px;
    }
    .mt-10 {
      margin-top: 10px;
    }
    .clear {
      &:after {
        content: '';
        width: 0;
        height: 0;
        display: block;
        clear: both;
      }

      .fl {
        float: left;
      }
      .fr {
        float: right;
      }
    }

    .calendar-title {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        cursor: pointer;
        display: inline-block;
      }
      .btn-group {
        .btn {
          padding: 6px 12px;
        }
      }
    }
    .calendar-row {
      display: flex;
      flex-wrap: wrap;
      flex-grow: 2;

      li {
        width: calc((100% - 8px) / 7);
        height: 80px;
        border-width: 0 1px 1px 0;
        border-color: #666;
        border-style: solid;
        box-sizing: content-box;

        p {
          padding: 2px 5px;
        }

        &:nth-child(7n-6) {
          border-left: 1px solid #999;
        }
        &:not(:nth-child(n+8)) {
          border-top: 1px solid #999;
        }
        &:nth-child(7n-6),
        &:nth-child(7n) {
          background-color: #f0f0f0;
        }
      }
      &.calender-header span {
        width: calc((100% - 8px) / 7);
        margin: 0 1px 0 0;
        box-sizing: content-box;
      }

      .col-gray {
        color: #999;
      }
      .col-red {
        color: red;
      }
    }
  }
}
</style>
