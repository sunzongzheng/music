import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './components'
import '../renderer/assets/iconfont'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

import initMacStatusbarLyric from './macStatusBarLyric'

if(process.platform === 'darwin') {
    initMacStatusbarLyric()
}

new Vue({
    components: {App},
    router,
    template: '<App/>'
}).$mount('#app')
