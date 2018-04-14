'use strict'

import { app, Menu, Tray, BrowserWindow, nativeImage, ipcMain } from 'electron'
import ipcEvent from './ipcEvent'
import g from './global'
import { version } from '../../package.json'
import axios from 'axios'
import { spawn } from 'child_process'
const Canvas = require('canvas-prebuilt')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
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
  // const canvas = new Canvas(200, 200)
  // const ctx = canvas.getContext('2d')
  //
  // ctx.font = '30px Impact'
  // ctx.rotate(0.1)
  // ctx.fillText('Awesome!', 50, 100)

  // let next = new Tray(__static + '/images/next_16.png')
  // let play = new Tray(__static + '/images/play_16.png')
  // let text = new Tray(nativeImage.createEmpty())
  // text.setTitle('听想听的音乐')
  // play.setToolTip('播放/暂停')
  // next.setToolTip('下一首')
  // let pause = true
  // play.on('click', () => {
  //   mainWindow.webContents.send('tray-control-pause', !pause)
  // })
  // next.on('click', () => {
  //   mainWindow.webContents.send('tray-control-next')
  // })
  // ipcMain.on('tray-control-pause', (event, arg) => {
  //   pause = arg
  //   play.setImage(__static + `/images/${arg ? 'play' : 'pause'}_16.png`)
  //   next.setToolTip('下一首')
  // })
  // ipcMain.on('tray-control-lyrics', (event, arg) => {
  //   text.setTitle(arg)
  // })
  appTray = new Tray(nativeImage.createEmpty())
  // appTray.setImage(nativeImage.createFromDataURL(canvas.toDataURL()))
  global.setLyric = (data, width, height) => {
    // appTray.setImage(nativeImage.createFromDataURL(data).resize({
    //   width,
    //   height
    // }))
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
  axios('https://raw.githubusercontent.com/sunzongzheng/music/master/package.json')
    .then(({data}) => {
      let cur_version = version.split('.')
      data.version = data.version.split('.')
      cur_version = parseInt(cur_version[0]) * 10000 + parseInt(cur_version[1]) * 100 + parseInt(cur_version[2])
      data.version = parseInt(data.version[0]) * 10000 + parseInt(data.version[1]) * 100 + parseInt(data.version[2])
      if (cur_version < data.version) {
        mainWindow.webContents.send('version_new')
      }
    })
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  if (process.platform !== 'darwin') {
    initialTray(mainWindow)
  } else {
    initMacTray(mainWindow)
  }
  g.init(mainWindow)
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