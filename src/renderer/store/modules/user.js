import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    info: null
  },
  mutations: {
    update(state, val) {
      state.info = val
      // 初始化歌单
      Vue.store.dispatch('playlist/init')
    }
  },
  actions: {
    async init({commit}) {
      try {
        const data = await Vue.http.get('/user')
        commit('update', data)
      } catch (e) {
        console.warn(e)
      }
    },
    logout({commit}) {
      commit('update', null)
      Vue.store.commit('token/clear')
      Vue.$message.success('退出成功')
    }
  }
}
