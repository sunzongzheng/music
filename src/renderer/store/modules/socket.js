export default {
    namespaced: true,
    state: {
        onlineTotal: 0, // 实时在线人数
    },
    mutations: {
        update(state, val) {
            for (let i in val) {
                state[i] = val[i]
            }
        }
    }
}