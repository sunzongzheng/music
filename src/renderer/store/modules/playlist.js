import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    playlist: []
  },
  mutations: {
    update (state, val) {
      state.playlist = val
    }
  },
  actions: {
    async init ({commit}) {
      try {
        let data = await Vue.http.get('/playlist')
        commit('update', data)
      } catch (e) {
        commit('update', [])
        console.warn(e)
      }
    },
    async add (store, name) {
      try {
        await Vue.http.post('/playlist', {
          name
        })
      } catch (e) {
        console.warn(e)
      }
    }
  }
}
