export default {
  namespaced: true,
  state: {
    info: null
  },
  mutations: {
    update (state, val) {
      state.info = val
    }
  }
}
