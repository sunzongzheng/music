import {ipcMain} from 'electron'
import login from './login'
import share from './share'

export default function (mainWindow, backgroundWindow) {
    ipcMain.on('login', (event) => {
        login.init(event, mainWindow)
    })
    ipcMain.on('share', (event, params) => {
        share.init(event, mainWindow, params)
    })
    // 更新歌词
    ipcMain.on('tray-control-lyrics', (event, arg) => {
        backgroundWindow.webContents.send("tray-control-lyrics", arg)
    })
    // 上一曲
    ipcMain.on('tray-control-last', () => {
        mainWindow.webContents.send("tray-control-last")
    })
    // 播放/暂停
    ipcMain.on('tray-control-pause', (event, arg) => {
        mainWindow.webContents.send('tray-control-pause', arg)
    })
    ipcMain.on('tray-control-pause-main', (event, arg) => {
        backgroundWindow.webContents.send('tray-control-pause-main', arg)
    })
    // 下一曲
    ipcMain.on('tray-control-next', () => {
        mainWindow.webContents.send("tray-control-next")
    })
    // 显示主窗口
    ipcMain.on('tray-control-showMainWindow', () => {
        mainWindow.show()
    })
}
