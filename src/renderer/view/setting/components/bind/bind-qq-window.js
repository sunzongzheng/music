import { remote } from 'electron'

export default {
    loginWindow: null,
    loginUrl: 'https://y.qq.com',
    init() {
        this.createWindow()
        this.loginWindow.loadURL(this.loginUrl)
    },
    // 创建窗口
    createWindow() {
        this.loginWindow = new remote.BrowserWindow({
            title: '绑定QQ音乐账号',
            parent: Vue.$mainWindow,
            height: 700,
            resizable: false,
            width: 985,
            frame: true,
            fullscreen: false,
            maximizable: false,
            minimizable: false,
            autoHideMenuBar: true,
            webPreferences: {
                sandbox: true,
            },
        })
        this.loginWindow.setMenu(null) // 去掉windows linux下的Menu
        this.initEvent()
    },
    // 初始化  事件
    initEvent() {
        this.loginWindow.webContents.on('did-finish-load', () => {
            this.loginWindow.webContents.executeJavaScript(`
                setTimeout(() => {
                    document.body.querySelector('.top_login__link.js_login').click()
                }, 500)
            `)
        })
        const cookies = this.loginWindow.webContents.session.cookies
        cookies.on('changed', (event, cookie, cause) => {
            if (cookie.name === 'p_skey') {
                cookies.get({ url: 'https://y.qq.com' }, async (error, cookies) => {
                    if (error) {
                        this.loginWindow.destroy()
                        Vue.$message.warning('获取登录状态失败')
                    } else {
                        this.loginWindow.destroy()
                        const cookieObject = {}
                        const cookieStr = cookies.map(item => {
                            cookieObject[item.name] = item.value
                            return `${item.name}=${item.value}`
                        }).join('; ')
                        Vue.$store.commit('user/updateBind', {
                            vendor: 'qq',
                            value: {
                                nickname: null,
                                avatar: null,
                                cookies: cookieStr,
                            },
                        })
                        Vue.$store.dispatch('user/checkQQBindAvalible', true)
                    }
                })
            }
        })
    },
}
