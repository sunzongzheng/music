'use strict'

import {app, Menu, Tray, BrowserWindow, nativeImage, ipcMain} from 'electron'
import ipcEvent from './ipcEvent'
import g from './global'
import autoUpdater from '@suen/electron-updater'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let backgroundWindow
let appTray // 声明在外层 保证不会被垃圾回收 解决windows托盘图标会消失的问题
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`

function initialTray(mainWindow) {
    var trayIconPath = __static + '/images/logo_32.png'
    appTray = new Tray(trayIconPath)

    function toggleVisiable() {
        var isVisible = mainWindow.isVisible()
        if (isVisible) {
            mainWindow.hide()
        } else {
            mainWindow.show()
        }
    }

    const contextMenu = Menu.buildFromTemplate([
        {
            label: '显示主界面',
            click() {
                mainWindow.show()
            }
        },
        {
            label: '退出',
            click() {
                app.quit()
            }
        }
    ])
    appTray.setToolTip('Player')
    appTray.setContextMenu(contextMenu)
    appTray.on('click', function handleClicked() {
        toggleVisiable()
    })
}


function initMacTray(mainWindow) {
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
    appTray = new Tray(nativeImage.createEmpty())
    appTray.setHighlightMode('never')
    appTray.on('click', (event, bounds, position) => {
        backgroundWindow.webContents.send('tray-click', {event, bounds, position})
    })
    global.setTray = function (img, width, height) {
        const Image = nativeImage.createFromDataURL(img).resize({
            width,
            height
        })
        appTray.setImage(Image)
    }
}

function createWindow() {
    mainWindow = new BrowserWindow({
        height: 650,
        useContentSize: true,
        minimizable: true,
        fullscreenable: true,
        maximizable: false,
        width: 980,
        frame: false,
        webPreferences: {
            backgroundThrottling: false
        }
    })
    ipcEvent.on(mainWindow)
    // mainWindow.webContents.openDevTools({detach: true})
    mainWindow.loadURL(winURL)
    mainWindow.on('closed', () => {
        mainWindow = null
    })
    if (process.platform !== 'darwin') {
        initialTray(mainWindow)
    } else {
        initMacTray(mainWindow)
    }
    g.init(mainWindow)
    const update = autoUpdater({
        type: 'custom',
        options: {
            url: 'https://gist.githubusercontent.com/sunzongzheng/e7b502eee0610e316ddaa6b40ea2e5c7/raw/'
        }
    })
    global.updater = update
    createBackgroundWindow()
    setTimeout(() => {
        update.checkForUpdatesAndNotify()
    }, 5000)
}

// 创建子渲染进程
function createBackgroundWindow() {
    const winURL = process.env.NODE_ENV === 'development'
        ? `http://localhost:9081/background.html`
        : `file://${__dirname}/background.html`
    backgroundWindow = new BrowserWindow({
        height: 650,
        useContentSize: true,
        minimizable: true,
        fullscreenable: false,
        maximizable: false,
        width: 980,
        show: false,
        webPreferences: {
            backgroundThrottling: false
        }
    })
    backgroundWindow.loadURL(winURL)
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

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */