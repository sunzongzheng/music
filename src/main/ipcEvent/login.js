import { BrowserWindow } from 'electron'

export default {
  loginWindow: null,
  mainWindow: null,
  loginUrl: 'http://127.0.0.1:1903/auth/qq',
  init (event, mainWindow) {
    this.mainWindow = mainWindow
    this.createWindow()
    this.loginWindow.loadURL(this.loginUrl)
    this.loginWindow.show()
  },
  // 创建窗口
  createWindow () {
    this.loginWindow = new BrowserWindow({
      parent: this.mainWindow,
      height: 600,
      resizable: false,
      width: 450,
      frame: true
    })
    this.initEvent()
  },
  // 初始化  事件
  initEvent () {
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
      let {data} = await this.loginWindow.webContents.executeJavaScript(`
      fetch(window.login_callback).then(resp => resp.json())
      `)
      this.loginWindow.destroy()
      this.mainWindow.webContents.send('loginSuccessed', data)
    })
  }
}
