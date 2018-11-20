import { webFrame, remote } from 'electron'

export default function(Vue) {
    webFrame.setVisualZoomLevelLimits(1, 1) // 禁用缩放

    Vue.$mainWindow = Vue.prototype.$mainWindow = remote.getCurrentWindow()
}
