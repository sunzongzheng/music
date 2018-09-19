import {BrowserWindow} from 'electron'
import {URL} from 'url'

export default {
    window: null,
    mainWindow: null,
    init(event, mainWindow, params) {
        console.log(params)
        this.mainWindow = mainWindow
        this.createWindow()
        const url = new URL(mainWindow.webContents.getURL())
        url.hash = '/add-to-playlist'
        this.window.loadURL(url.href)
        this.window.webContents.on('dom-ready', () => {
            this.window.webContents.send('add-to-playlist-info', params)
        })
        this.window.show()
    },
    // 创建窗口
    createWindow() {
        this.window = new BrowserWindow({
            title: '添加到歌单',
            parent: this.mainWindow,
            height: 450,
            resizable: true,
            width: 750,
            frame: true,
            fullscreen: false,
            maximizable: false,
            minimizable: false,
            autoHideMenuBar: true
        })
        this.window.setMenu(null) // 去掉windows linux下的Menu
    }
}