import { ipcRenderer } from 'electron'

export default {
  namespaced: true,
  state: {
    status: 'show' // 默认开启状态
  },
  mutations: {
    update (state, val) {
      state.status = val
      ipcRenderer.send('viewControl', val)
    }
  }
}
