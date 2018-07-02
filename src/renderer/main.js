import Vue from 'vue'
import axios from 'axios'
import ElementUI from 'element-ui'
import VueContextMenu from '@xunlei/vue-context-menu'
import './assets/theme.scss'
import directive from 'element-ui/packages/popover/src/directive'
import App from './App'
import router from './router'
import store from './store'
import './assets/iconfont'
import './components'
import {ipcRenderer, remote} from 'electron'
import './filters'
import config from '../../config/index'

require('electron').webFrame.setVisualZoomLevelLimits(1, 1) // 禁用缩放

Vue.use(ElementUI)
Vue.use(VueContextMenu)
Vue.directive('popover', directive)

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
instance.interceptors.response.use(
    response => response.data,
    e => {
        if (e.response) {
            const data = e.response.data
            if(e.response.status === 401) {
                localStorage.removeItem('token')
            }else if (data.msg) {
                Vue.$message.warning(data.msg)
            }
        } else {
            Vue.$message.warning('请检查网络连接')
        }
        return Promise.reject(e)
    })
Vue.http = Vue.prototype.$http = instance

Vue.clientApi = remote.getGlobal('clientApi')

Vue.api = Vue.prototype.$api = remote.getGlobal('api')

Vue.win = Vue.prototype.$win = remote.getGlobal('win')

Vue.store = Vue.prototype.$store = store

Vue.router = router

Vue.config.productionTip = false

Vue.ipc = Vue.prototype.$ipc = ipcRenderer

Vue.updater = Vue.prototype.$updater = remote.getGlobal('updater')

Vue.$message = ElementUI.Message

/* eslint-disable no-new */
new Vue({
    components: {App},
    router,
    store,
    template: '<App/>'
}).$mount('#app')
