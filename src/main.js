import  'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'
import 'common/scss/index.scss'
Vue.config.productionTip = false
Vue.use(VueLazyload, {
	loading: require('common/images/default.png')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
