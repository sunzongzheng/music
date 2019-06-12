import {ipcMain, nativeImage, app} from 'electron'
import login from './login'
import share from './share'
import addToPlaylist from './add-to-playlist'
import url from 'url'

const {download} = require('electron-dl')
const downloads = {}

export default function (mainWindow, backgroundWindow, touchBar) {
    ipcMain.on('login', (event) => {
        login.init(event, mainWindow)
    })
    ipcMain.on('share', (event, params) => {
        share.init(event, mainWindow, params)
    })
    ipcMain.on('add-to-playlist', (event, params) => {
        addToPlaylist.init(event, mainWindow, params)
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
        if (process.platform !== 'darwin') return
        touchBar.items[2].icon = nativeImage.createFromPath(__static + `/touch-bar/${arg ? 'play' : 'pause'}.png`).resize({
            width: 18,
            height: 18
        })
    })
    // 下一曲
    ipcMain.on('tray-control-next', () => {
        mainWindow.webContents.send("tray-control-next")
    })
    // 显示主窗口
    ipcMain.on('tray-control-showMainWindow', () => {
        mainWindow.show()
    })
    // 切换桌面歌词
    ipcMain.on('backgroundWindowStatusChange', (event, arg) => {
        mainWindow.webContents.send('backgroundWindowStatusChange', arg)
    })
    // 音量
    // ipcMain.on('tray-control-volume', (event, arg) => {
    //     touchBar.items[4].value = parseInt(arg)
    // })
    // 歌曲进度
    ipcMain.on('tray-control-progress', (event, arg) => {
        if (process.platform !== 'darwin') return
        touchBar.items[4].value = parseInt(arg) + 1
    })
    ipcMain.on('toggle-tray', (event, arg) => {
        if (arg) {
            (!global.Tray.tray || global.Tray.tray.isDestroyed()) && global.Tray.init()
        } else {
            (global.Tray.tray && !global.Tray.tray.isDestroyed()) && global.Tray.destroy()
        }
    })
    ipcMain.on('download-btn', (e, args) => {
        download(mainWindow, args.url, {
            filename: args.filename,
            directory: `${app.getPath('music')}/音乐湖`,
            onProgress(progress) {
                mainWindow.webContents.send('download-onProgress', {
                    id: args.id,
                    progress: progress * 100
                })
            },
            onStarted(downloadItem) {
                mainWindow.webContents.send('download-onStarted', {
                    id: args.id,
                    downloadItem
                })
                downloads[args.id] = downloadItem
            }
        })
            .then(downloadItem => {
                mainWindow.webContents.send('download-success', {
                    id: args.id,
                    downloadItem
                })
            })
            .catch(e => {
                console.warn(e)
                mainWindow.webContents.send('download-error', {
                    id: args.id,
                    error: e
                })
            })
    })
    ipcMain.on('download-cancel', (e, id) => {
        downloads[id].cancel && downloads[id].cancel()
    })
    ipcMain.on('set-proxy', (e, val) => {
        console.log('set-proxy', val)
        const {hostname, port} = url.parse(val)
        const ses = mainWindow.webContents.session
        ses.setProxy({
            proxyRules: (hostname && port) ? `${hostname}:${port}` : ''
        }, function () {
        })
    })
}
