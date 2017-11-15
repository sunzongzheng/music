'use strict'

import { app, Menu, Tray, BrowserWindow } from 'electron'
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
