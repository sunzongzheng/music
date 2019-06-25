import { globalShortcut, BrowserWindow } from 'electron'

function toggleDevTools(win = BrowserWindow.getFocusedWindow()) {
    if (win) {
        const { webContents } = win
        if (webContents.isDevToolsOpened()) {
            webContents.closeDevTools()
        } else {
            webContents.openDevTools()
        }
    }
}

function refresh(win = BrowserWindow.getFocusedWindow()) {
    if (win) {
        win.webContents.reloadIgnoringCache()
    }
}

const isMacOS = process.platform === 'darwin'

require('electron').app.on('ready', () => {
    globalShortcut.register('F12', toggleDevTools)
    globalShortcut.register(
        isMacOS ? 'Command+Alt+I' : 'Control+Shift+I',
        toggleDevTools
    )
    globalShortcut.register('CommandOrControl+R', refresh)
    globalShortcut.register('F5', refresh)

    let installExtension = require('electron-devtools-installer')
    installExtension
        .default(installExtension.VUEJS_DEVTOOLS.id)
        .then(() => {})
        .catch(err => {
            console.log('Unable to install `vue-devtools`: \n', err)
        })
})

require('./index')
