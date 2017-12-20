import Vue from 'vue'

export default {
  namespaced: true,
  state: {
    info: null
  },
  mutations: {
    update(state, val) {
      for (let i in val)
        state[i] = val[i]
    }
  }
}
