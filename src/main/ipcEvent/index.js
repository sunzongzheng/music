import {ipcMain} from 'electron'
import login from './login'
import share from './share'

export default {
    on(mainWindow) {
        ipcMain.on('login', (event) => {
            login.init(event, mainWindow)
        })
        ipcMain.on('share', (event, params) => {
            share.init(event, mainWindow, params)
        })
    }
}
