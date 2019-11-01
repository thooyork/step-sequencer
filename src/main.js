import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vue2TouchEvents from 'vue2-touch-events'

Vue.use(Vue2TouchEvents, {
  disableClick: false, //Use touch event only, will not trigger click event.
  touchClass: 'touchactive', //Add an extra CSS class when touch start, and remove it when touch end.
  tapTolerance: 10,
  swipeTolerance: 30,
  longTapTimeInterval: 400
});

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
