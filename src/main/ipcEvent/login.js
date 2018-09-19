import {BrowserWindow} from 'electron'
import config from '../../../config/index'

export default {
    loginWindow: null,
    mainWindow: null,
    loginUrl: config.api + '/auth/qq',
    init(event, mainWindow) {
        this.mainWindow = mainWindow
        this.createWindow()
        this.loginWindow.loadURL(this.loginUrl)
        this.loginWindow.show()
    },
    // 创建窗口
    createWindow() {
        this.loginWindow = new BrowserWindow({
            title: 'QQ登录',
            parent: this.mainWindow,
            height: 600,
            resizable: false,
            width: 450,
            frame: true,
            fullscreen: false,
            maximizable: false,
            minimizable: false,
            autoHideMenuBar: true
        })
        this.loginWindow.setMenu(null) // 去掉windows linux下的Menu
        this.initEvent()
    },
    // 初始化  事件
    initEvent() {
        // url 接收
        this.loginWindow.webContents.executeJavaScript(`
      require('electron').ipcRenderer.on('url', (event, message) => {
      window.login_callback = message
    })
    `)
        // 跳转事件
        this.loginWindow.webContents.on('will-navigate', async (event, url) => {
            // 阻止跳转
            event.preventDefault()
            // 将 即将跳转的url发送给登录窗口
            this.loginWindow.webContents.send('url', url)
            // 登录窗口请求数据 并将数据暴露出来
            let data = await this.loginWindow.webContents.executeJavaScript(`
      fetch(window.login_callback).then(resp => resp.json())
      `)
            console.log(data)
            this.loginWindow.destroy()
            this.mainWindow.webContents.send('loginSuccessed', data)
        })
    }
}
