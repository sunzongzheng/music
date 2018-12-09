import {
    Popover,
    Message,
    Button,
    Loading,
    Input,
    Col,
    Row,
    Pagination,
    Slider,
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/reset.css'

export default function install(Vue) {
    Vue.use(Popover)
    Vue.use(Button)
    Vue.use(Loading)
    Vue.use(Input)
    Vue.use(Col)
    Vue.use(Row)
    Vue.use(Pagination)
    Vue.use(Slider)
    Vue.$message = Vue.prototype.$message = Message
}
