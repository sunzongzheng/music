import App from './App'
import electron from './plugins/electron'
import store from './plugins/store'
import router from './plugins/router'
import config from './plugins/config'
import elementUI from './plugins/element-ui'
import components from './plugins/components'
import http from './plugins/http'
import './assets/iconfont'

Vue.use(config)
Vue.use(electron)
Vue.use(http)
Vue.use(router)
Vue.use(store)
Vue.use(elementUI)
Vue.use(components)

new Vue({
    components: { App },
    router: Vue.$router,
    store: Vue.$store,
    template: '<App/>',
}).$mount('#app')
