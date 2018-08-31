import Vue from 'vue'

export default {
    namespaced: true,
    state: {
        playlist: []
    },
    mutations: {
        update(state, val) {
            state.playlist = val
        }
    },
    actions: {
        async init({commit}) {
            try {
                let data = await Vue.$http.get('/playlist')
                commit('update', data)
            } catch (e) {
                commit('update', [])
                console.warn(e)
            }
        },
        add(store, name) {
            return Vue.$http.post('/playlist', {
                name
            })
        },
        async collect(store, {id, info}) {
            await Vue.$http.post(`/playlist/${id}`, info)
            Vue.$message.success('添加成功')
        }
    }
}
