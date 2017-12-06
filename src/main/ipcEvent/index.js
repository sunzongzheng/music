import { ipcMain } from 'electron'
import login from './login'

export default {
  on(mainWindow) {
    ipcMain.on('login', (event) => {
      login.init(event, mainWindow)
    })
  }
}
