import {remote} from 'electron'
import config from '../../../../../../config/index'
import {URL} from 'url'

export default {
    loginWindow: null,
    loginUrl: config.api + '/auth/weibo',
    init() {
        this.createWindow()
        this.loginWindow.loadURL(this.loginUrl)
        this.loginWindow.show()
    },
    // 创建窗口
    createWindow() {
        this.loginWindow = new remote.BrowserWindow({
            title: '微博登录',
            parent: Vue.$mainWindow,
            height: 600,
            resizable: false,
            width: 750,
            frame: true,
            fullscreen: false,
            maximizable: false,
            minimizable: false,
            autoHideMenuBar: true
        })
        // this.loginWindow.webContents.openDevTools()
        this.loginWindow.setMenu(null) // 去掉windows linux下的Menu
        this.initEvent()
    },
    // 初始化  事件
    initEvent() {
        this.loginWindow.webContents.on('did-navigate', async (event, url) => {
            const _url = new URL(url)
            if (_url.pathname === '/auth/weibo/callback') {
                remote.session.defaultSession.cookies.get({name: 'accesstoken'}, (error, cookies) => {
                    this.loginWindow.destroy()
                    if (error) {
                        Vue.$message.warning('登录失败')
                    } else if (cookies.length) {
                        Vue.$store.commit('token/update', cookies[0].value)
                        Vue.$store.dispatch('user/init')
                    }
                })
            }
        })
    }
}
