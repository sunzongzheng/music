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
                dispatch('user/init', null, { root: true })
            } else {
                commit(
                    'user/profile/update',
                    {
                        nickname: null,
                        avatar: null,
                    },
                    { root: true }
                )
            }
        },
    },
}
