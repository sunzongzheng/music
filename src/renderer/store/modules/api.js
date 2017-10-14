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
      pause: true
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
    search ({state, commit}, {keywords, page = 1, limit = 60}) {
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
      ipcRenderer.on('searchSong', (event, data) => {
        let songList = {}
        let result = []
        let maxLength = 0
        for (let i in data) {
          songList[i] = data[i].songList || []
          const length = songList[i].length
          if (length > maxLength) {
            maxLength = length
          }
        }
        let cur = 0
        while (cur < maxLength) {
          for (let i in songList) {
            const item = songList[i][cur]
            if (item && !item.needPay) {
              result.push({
                ...item,
                source: i
              })
            }
          }
          cur++
        }
        commit('updateSearch', {
          result
        })
      })
    },
    async play ({commit}, {id, source}) {
      ipcRenderer.send('api', {
        op: 'getSong',
        vendor: source,
        query: {
          id
        }
      })
      ipcRenderer.on('getSong', (event, {url}) => {
        commit('updatePlay', {
          url,
          pause: false
        })
      })
    }
  }
}
