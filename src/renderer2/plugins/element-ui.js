import { Popover, Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/reset.css'

export default function install(Vue) {
    Vue.use(Popover)
    Vue.$message = Vue.prototype.$message = Message
}
