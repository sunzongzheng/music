export default {
    namespaced: true,
    state: {
        list: [],
    },
    mutations: {
        update(state, list) {
            state.list = list
        },
    },
    actions: {
        async init({ commit }) {
            const data = await Vue.$http.get('/playlist')
            commit('update', data)
        },
        clear({ commit }) {
            commit('update', [])
        },
        async getPlaylistSong(ctx, id) {
            return Vue.$http.get(`/playlist/${id}`)
        },
        async collect(ctx, { playlistId, song }) {
            return Vue.$http.post(`/playlist/${playlistId}`, song)
        },
    },
}
