export default {
    namespaced: true,
    state: {
        nickname: null,
        avatar: null,
    },
    mutations: {
        update(state, { nickname, avatar }) {
            state.nickname = nickname
            state.avatar = avatar
        },
    },
    actions: {
        async init({ commit }) {
            const data = await Vue.$http.get('/user')
            commit('update', data)
        },
    },
}
