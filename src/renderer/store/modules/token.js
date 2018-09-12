export default {
    namespaced: true,
    state: {
        token: null
    },
    mutations: {
        update(state, val) {
            state.token = val
            localStorage.token = val
            Vue.$socket.connect() // 连接 socket
        },
        clear() {
            localStorage.removeItem('token')
        }
    }
}
