export default {
    namespaced: true,
    state: {
        token: JSON.parse(localStorage.getItem('token') || null),
    },
    mutations: {
        update(state, val) {
            state.token = val
            if (val) {
                localStorage.setItem('token', JSON.stringify(val))
            } else {
                localStorage.removeItem('token')
            }
        },
    },
    actions: {
        update({ commit, dispatch }, val) {
            commit('update', val)
            if (val) {
                Vue.$store.dispatch('user/init')
            } else {
                Vue.$store.commit('user/profile/update', {
                    nickname: null,
                    avatar: null,
                })
            }
        },
    },
}
