import profile from './user/profile'
import setting from './user/setting'
import token from './user/token'
import playlist from './user/playlist'

export default {
    namespaced: true,
    modules: {
        profile,
        setting,
        token,
        playlist,
    },
    actions: {
        logout({ dispatch }) {
            dispatch('user/token/update', null, { root: true })
            dispatch('user/playlist/online/clear', null, { root: true })
        },
        init({ dispatch }) {
            dispatch('user/profile/init', null, { root: true })
            dispatch('user/playlist/online/init', null, { root: true })
        },
    },
    getters: {
        logged(state, getters, rootState) {
            return Boolean(rootState.user.token.token)
        },
    },
}
