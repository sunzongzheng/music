export default function install(Vue) {
    Vue.$config = Vue.prototype.$config = {
        api: 'https://player2.zzsun.cc',
        socket: 'https://socket.zzsun.cc',
    }
}
