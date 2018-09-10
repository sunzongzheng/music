import Vue from 'vue'
import {ipcRenderer} from 'electron'
import App from './App.vue'
import router from './router'
import './components'
import '../renderer/assets/iconfont'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

import initMacStatusbarLyric from './macStatusBarLyric'


ipcRenderer.on('showMacStatusBar', (event, arg) => {
    initMacStatusbarLyric()
})
new Vue({
    components: {App},
    router,
    template: '<App/>'
}).$mount('#app')
