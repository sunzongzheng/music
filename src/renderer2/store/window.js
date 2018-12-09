export default {
    namespaced: true,
    state: {
        status: null, // normal: 正常; minimized: 最小化; hiden: 被隐藏; fullscreen: 全屏
    },
    mutations: {
        updateStatus(state, status) {
            state.status = status
        },
    },
    actions: {
        close({ commit }) {
            commit('updateStatus', 'hiden')
            Vue.$mainWindow.hide()
        },
        minimize({ commit }) {
            commit('updateStatus', 'minimized')
            Vue.$mainWindow.minimize()
        },
        fullscreen({ commit }) {
            commit('updateStatus', 'fullscreen')
            Vue.$mainWindow.setFullScreen(true)
        },
        leaveFullscreen({ commit }) {
            commit('updateStatus', 'normal')
            Vue.$mainWindow.setFullScreen(false)
        },
    },
}
