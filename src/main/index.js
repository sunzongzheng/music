import { app, globalShortcut } from 'electron'
import Tray from './tray'
import initTouchBar from './touch-bar'
import initUpdater from './updater'
import initWindow from './window'
import initIpcEvent from './ipcEvent'
import initMenu from './menu'
import axios from 'axios'
import nodeAdapter from 'flyio/src/adapter/node'
import URL from 'url'

if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path')
        .join(__dirname, '/static')
        .replace(/\\/g, '\\\\')
}
global.clientApi = axios
global.Tray = Tray
global.nodeAdapter = nodeAdapter

let mainWindow
let backgroundWindow
let touchBar

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
    app.quit()
} else {
    const createWindow = () => {
        const windows = initWindow()
        mainWindow = windows.mainWindow
        backgroundWindow = windows.backgroundWindow
        global.mainWindow = windows.mainWindow
        global.backgroundWindow = windows.backgroundWindow
        mainWindow.once('ready-to-show', () => {
            mainWindow.show()
        })
        initMenu()
        // mainWindow.webContents.openDevTools({detach: true})
        mainWindow.on('closed', () => {
            mainWindow = null
        })
        initUpdater()
        touchBar = initTouchBar()
        initIpcEvent(mainWindow, backgroundWindow, touchBar)
    }

    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            if (!mainWindow.isVisible()) mainWindow.show()
            mainWindow.focus()
        }
    })

    app.on('ready', () => {
        const protocol = 'musiclake'
        if (process.platform === 'win32') {
            app.setAsDefaultProtocolClient(protocol, process.execPath, [
                '--protocol-launcher',
            ])
        } else {
            app.setAsDefaultProtocolClient('musiclake')
        }
        app.on('open-url', (event, url) => {
            event.preventDefault()
            const { hostname, query } = URL.parse(url, true)
            if (hostname === 'oauth' && query.accesstoken) {
                mainWindow.webContents.send(
                    'login-with-token',
                    query.accesstoken
                )
            }
        })
        createWindow()
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    app.on('will-quit', () => {
        // 清空所有快捷键
        globalShortcut.unregisterAll()
    })

    app.on('activate', () => {
        if (mainWindow === null) {
            createWindow()
        } else {
            mainWindow.show()
        }
    })
}
