import axios from 'axios'
// 引入echarts
import * as echarts from 'echarts'
// 导入进度条组件
import NProgress from 'nprogress'
import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'

// 引入全局样式表
import '../src/assets/css/globa.css'
// 导入进度条组件样式文件
import 'nprogress/nprogress.css'

// 将echarts配置成全局
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
// 导入 axios 组件
axios.defaults.baseURL = 'http://localhost:3000/'
// 对 axios 进行全局配置
Vue.prototype.$http = axios

// 请求拦截
axios.interceptors.request.use(config => {
  NProgress.start()
  // 为请求头对象添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
