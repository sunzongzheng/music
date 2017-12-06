import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui'
import VueContextMenu from '@xunlei/vue-context-menu'
import 'element-ui/lib/theme-chalk/index.css'
import directive from 'element-ui/packages/popover/src/directive'
import App from './App'
import router from './router'
import store from './store'
import './assets/iconfont'
import './components'
import { ipcRenderer, remote } from 'electron'
import './filters'
import config from '../../config/index'

Vue.use(ElementUI)
Vue.use(VueContextMenu)
Vue.directive('popover', directive)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

// http instance
const instance = axios.create({
  baseURL: config.api,
  timeout: 30000
})
instance.interceptors.request.use(function (config) {
  const token = localStorage.token
  if (token) {
    config.headers.accesstoken = token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
instance.interceptors.response.use(function (response) {
  if (response.status < 400 && response.data.status) {
    return response.data.data
  } else {
    return Promise.reject(response)
  }
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})
Vue.http = Vue.prototype.$http = instance

Vue.clientApi = remote.getGlobal('clientApi')

Vue.api = Vue.prototype.$api = remote.getGlobal('api')

Vue.win = Vue.prototype.$win = remote.getGlobal('win')

Vue.store = Vue.prototype.$store = store

Vue.config.productionTip = false

Vue.ipc = Vue.prototype.$ipc = ipcRenderer

Vue.$message = ElementUI.Message

/* eslint-disable no-new */
new Vue({
  components: {App},
  router,
  store,
  template: '<App/>'
}).$mount('#app')
