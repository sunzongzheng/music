import Vue from 'vue'
import ElementUI from 'element-ui'
import './assets/theme.scss'
import directive from 'element-ui/packages/popover/src/directive'
import App from './App'
import router from './router'
import './assets/iconfont'
import './components'
import { ipcRenderer, remote } from 'electron'
import './filters'
import http from './util/http'
import socket from './util/socket'
import contextMenu from './util/context-menu'
import musicApi from './util/musicApi'
import config from './util/config'

require('electron').webFrame.setVisualZoomLevelLimits(1, 1) // 禁用缩放

Vue.use(ElementUI)
Vue.directive('popover', directive)

Vue.$http = Vue.prototype.$http = http

Vue.$clientApi = remote.getGlobal('clientApi')

Vue.$mainWindow = Vue.prototype.$mainWindow = remote.getCurrentWindow()

Vue.$musicApi = Vue.prototype.$musicApi = musicApi

Vue.$ipc = Vue.prototype.$ipc = ipcRenderer

Vue.$store = Vue.prototype.$store = require('./store').default

Vue.$router = router

Vue.config.productionTip = false


Vue.$updater = Vue.prototype.$updater = remote.getGlobal('updater')

Vue.$message = ElementUI.Message

Vue.$notify = ElementUI.Notification

Vue.$socket = Vue.prototype.$socket = socket

Vue.$config = Vue.prototype.$config = config

Vue.$contextMenu = Vue.prototype.$contextMenu = contextMenu

/* eslint-disable no-new */
new Vue({
    components: { App },
    router,
    store: Vue.$store,
    template: '<App/>',
}).$mount('#app')
