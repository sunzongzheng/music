import { ipcMain } from 'electron'
import viewControl from './viewCtrol'
import login from './login'
import api from './api'

export default {
  on (mainWindow) {
    ipcMain.on('viewControl', (event, arg) => {
      viewControl.on(mainWindow, arg)
    })
    ipcMain.on('login', (event) => {
      login.init(event, mainWindow)
    })
    ipcMain.on('api', (event, arg) => {
      api.on(mainWindow, arg)
    })
  }
}
