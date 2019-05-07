import Vue from 'vue';
// import App from './App';
import leapCalendar from '../dist/leapCalendar.js';
import Test from './Test';

Vue.use(leapCalendar);

new Vue({
  el: '#root',
  render: (h) => h(Test)
})