import {app} from 'electron'
import initTray from './tray'
import initUpdater from './updater'
import initWindow from './window'
import initIpcEvent from './ipcEvent'
import musicApi from './musicApi'
import axios from 'axios'

if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}
global.musicApi = musicApi
global.clientApi = axios

let mainWindow
let backgroundWindow
let appTray // 声明在外层 保证不会被垃圾回收 解决windows托盘图标会消失的问题

function createWindow() {
    const windows = initWindow()
    mainWindow = windows.mainWindow
    backgroundWindow = windows.backgroundWindow
    initIpcEvent(mainWindow, backgroundWindow)
    // mainWindow.webContents.openDevTools({detach: true})
    mainWindow.on('closed', () => {
        mainWindow = null
    })
    initUpdater()
    appTray = initTray(mainWindow, backgroundWindow)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    } else {
        mainWindow.show()
    }
})