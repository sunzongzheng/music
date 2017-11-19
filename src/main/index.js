'use strict'

import { app, Menu, Tray, BrowserWindow, nativeImage, ipcMain } from 'electron'
import ipcEvent from './ipcEvent'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function initialTray (mainWindow) {
  var trayIconPath = __static + '/images/logo_32.png'
  let appTray = new Tray(trayIconPath)

  function toggleVisiable () {
    var isVisible = mainWindow.isVisible()
    if (isVisible) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出',
      click () {
        app.quit()
      }
    }
  ])
  appTray.setContextMenu(contextMenu)
  appTray.on('click', function handleClicked () {
    toggleVisiable()
  })
}

function initMacTray (mainWindow) {
  let next = new Tray(__static + '/images/next_16.png')
  let play = new Tray(__static + '/images/play_16.png')
  let text = new Tray(nativeImage.createEmpty())
  text.setTitle('听想听的音乐')
  play.setToolTip('播放/暂停')
  next.setToolTip('下一首')
  let pause = true
  play.on('click', () => {
    mainWindow.webContents.send('tray-control-pause', !pause)
  })
  next.on('click', () => {
    mainWindow.webContents.send('tray-control-next')
  })
  ipcMain.on('tray-control-pause', (event, arg) => {
    pause = arg
    play.setImage(__static + `/images/${arg ? 'play' : 'pause'}_16.png`)
    next.setToolTip('下一首')
  })
  ipcMain.on('tray-control-lyrics', (event, arg) => {
    text.setTitle(arg)
  })
}

function createWindow () {
  mainWindow = new BrowserWindow({
    height: 650,
    useContentSize: true,
    minimizable: true,
    fullscreenable: true,
    maximizable: false,
    width: 980,
    frame: false
  })
  ipcEvent.on(mainWindow)
  mainWindow.loadURL(winURL)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  if (process.platform !== 'darwin') {
    initialTray(mainWindow)
  } else {
    initMacTray(mainWindow)
  }
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
