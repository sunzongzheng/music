import {BrowserWindow} from 'electron'
import {URL} from 'url'

export default {
    window: null,
    mainWindow: null,
    init(event, mainWindow, params) {
        this.mainWindow = mainWindow
        this.createWindow()
        const url = new URL(mainWindow.webContents.getURL())
        url.hash = '/share'
        this.window.loadURL(url.href)
        this.window.webContents.on('dom-ready', () => {
            this.window.webContents.send('share-song-info', params)
        })
        this.window.show()
    },
    // 创建窗口
    createWindow() {
        this.window = new BrowserWindow({
            title: '分享',
            parent: this.mainWindow,
            height: 500,
            resizable: false,
            width: 400,
            frame: true,
            fullscreen: false,
            maximizable: false,
            minimizable: false,
            autoHideMenuBar: true
        })
        this.window.setMenu(null) // 去掉windows linux下的Menu
    }
}
