import {remote} from 'electron'

export default {
    namespaced: true,
    state: {
        status: 'show' // 默认显示状态  close:隐藏; minimize:最小化; fullscreen: 全屏; leaveFullscreen: 离开全屏
    },
    mutations: {
        update(state, val) {
            state.status = val
            const win = remote.getCurrentWindow()
            switch (val) {
                case 'close':
                    win.hide()
                    break
                case 'minimize':
                    win.minimize()
                    break
                case 'fullscreen':
                    win.setFullScreen(true)
                    break
                case 'leaveFullscreen':
                    win.setFullScreen(false)
                    break
            }
        }
    }
}
