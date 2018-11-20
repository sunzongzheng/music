export default {
    namespaced: true,
    state: {
        online: [],
        offline: [],
    },
    mutations: {
        updateOnline(state, list) {
            state.online = list
        },
    },
    actions: {
        async init({ commit }) {
            const data = await Vue.$http.get('/playlist')
            commit('updateOnline', data)
        },
    },
}
