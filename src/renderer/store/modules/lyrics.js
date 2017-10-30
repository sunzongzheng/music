export default {
  namespaced: true,
  state: {
    show: false
  },
  mutations: {
    update (state, val) {
      for (let i in val) {
        state[i] = val[i]
      }
    }
  }
}
