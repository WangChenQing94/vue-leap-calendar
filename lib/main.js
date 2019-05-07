import leapCalendar from './LeapCalendar';

const Calendar = {}
Calendar.install = function (Vue, options) {
  Vue.component('leapCalendar', leapCalendar)
}

export default Calendar;