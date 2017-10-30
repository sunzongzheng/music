export default {
  namespaced: true,
  state: {
    token: null
  },
  mutations: {
    update (state, val) {
      state.token = val
      localStorage.token = val
    },
    clear () {
      localStorage.removeItem('token')
    }
  }
}
