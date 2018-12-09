import online from './playlist/online'
import offline from './playlist/offline'

export default {
    namespaced: true,
    modules: {
        online,
        offline,
    },
    state: {},
    mutations: {},
    actions: {
        getPlaylistSong({ dispatch }, { id, type }) {
            return dispatch(`user/playlist/${type}/getPlaylistSong`, id, {
                root: true,
            })
        },
    },
    getters: {
        playlistObject(state, getters, rootState) {
            const online = {}
            const offline = {}
            rootState.user.playlist.online.list.forEach(
                item => (online[item.id] = item)
            )
            rootState.user.playlist.offline.list.forEach(
                item => (offline[item.id] = item)
            )
            return {
                online,
                offline,
            }
        },
    },
}
