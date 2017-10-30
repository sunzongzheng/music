import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    playlist: [],
    cycle: 'list' // list: 列表循环; random: 随机; single: 单曲
  },
  mutations: {
    update (state, val) {
      state.playlist = val
    },
    cycleChange (state) {
      let arr = ['list', 'single', 'random']
      arr.every((item, index) => {
        if (item === state.cycle) {
          state.cycle = arr[(index + 1) % 3]
          return false
        } else {
          return true
        }
      })
    }
  },
  actions: {
    last ({state}) {
      if (state.playlist.length) {
        const cur = Vue.store.state.api.play.info
        let index = -1
        state.playlist.forEach((item, i) => {
          if (item.id === cur.id && item.source === cur.source) {
            console.log(i)
            index = i
          }
        })
        switch (state.cycle) {
          case 'list':
            index = (index + state.playlist.length - 1) % state.playlist.length
            break
          case 'random':
            index = parseInt(Math.random() * (state.playlist.length - 1), 10) + 1
        }
        Vue.store.dispatch('api/play', state.playlist[index])
      }
    },
    next ({state}) {
      if (state.playlist.length) {
        const cur = Vue.store.state.api.play.info
        let index = -1
        state.playlist.forEach((item, i) => {
          if (item.id === cur.id && item.source === cur.source) {
            console.log(i)
            index = i
          }
        })
        switch (state.cycle) {
          case 'list':
            index = (index + state.playlist.length + 1) % state.playlist.length
            break
          case 'random':
            index = parseInt(Math.random() * (state.playlist.length - 1), 10) + 1
        }
        Vue.store.dispatch('api/play', state.playlist[index])
      }
    }
  }
}
