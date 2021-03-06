// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 必须在最开始引入垫片
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router/'
import store from './store/'
import http from './http'
import i18n from './lang'
import axios from 'axios'
import util from './utils/util'
import test from './utils/Text'
import md5 from 'md5'
import filter from './utils/Filter'
import url from './utils/HttpUrl'
// 引入全局工具函数
import * as utils from './utils'
// 引入全局过滤器
// import '@/filters'
import 'font-awesome/scss/font-awesome.scss'
// 在入口处引入模拟的假数据
import '@/mock'
// 引入完整的饿了么组件库
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import './assets/scss/element-variables.scss'
Vue.use(ElementUI);
Vue.prototype.$util=util
Vue.prototype.$md5=md5
Vue.prototype.$filter=filter
Vue.prototype.$text=test
Vue.prototype.LoginUrl=`${url.Baseurltwo}shellpos1010/`
Vue.prototype.urlTwo=`${url.Baseurltwo}shellpos1010/`
Vue.prototype.$axios=axios
Vue.prototype.$store = store
// 将http绑定到vue原型上
Vue.prototype.$http = http
  // 将公共汽车绑定到vue原型上
Vue.prototype.$bus = new Vue()
  // Vue 的全局配置
Vue.config.productionTip = false

new Vue({
  el: '#app',
  i18n,
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
