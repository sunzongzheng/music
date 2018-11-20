export default function install(Vue) {
    Vue.$config = Vue.prototype.$config = {
        api: 'https://player.zzsun.cc',
        socket: 'https://socket.zzsun.cc',
    }
}
