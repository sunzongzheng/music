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
        logout() {
            Vue.$store.dispatch('user/token/update', null)
        },
        init() {
            Vue.$store.dispatch('user/profile/init')
            Vue.$store.dispatch('user/playlist/init')
        },
    },
    getters: {
        logged() {
            return Boolean(Vue.$store.state.user.token.token)
        },
    },
}
