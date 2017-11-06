import { ipcRenderer } from 'electron'

export default {
  namespaced: true,
  state: {
    search: {
      keywords: '',
      result: []
    },
    play: {
      url: null,
      lyric: [],
      pause: true,
      volume: 100,
      time: 0,
      info: null
    }
  },
  mutations: {
    updateSearch (state, val) {
      for (let i in val) {
        state.search[i] = val[i]
      }
    },
    updatePlay (state, val) {
      for (let i in val) {
        state.play[i] = val[i]
      }
    },
    pauseChange (state) {
      state.play.pause = !state.play.pause
    }
  },
  actions: {
    search ({commit}, {keywords, page = 1, limit = 60}) {
      commit('updateSearch', {
        keywords
      })
      ipcRenderer.send('api', {
        op: 'searchSong',
        vendor: 'all',
        query: {
          key: keywords,
          limit,
          page
        }
      })
    },
    async play ({commit}, info) {
      console.log(info)

      commit('updatePlay', {
        info,
        pause: true
      })
      ipcRenderer.send('api', {
        op: 'getSong',
        vendor: info.source,
        query: {
          id: info.id
        }
      })
    }
  }
}
