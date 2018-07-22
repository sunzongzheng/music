export default {
    namespaced: true,
    state: {
        keywords: '',
        loading: false
    },
    mutations: {
        update(state, val) {
            for (let i in val) {
                state[i] = val[i]
            }
        }
    }
}
