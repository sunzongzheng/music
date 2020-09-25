import { remote } from 'electron'

export default {
    loginWindow: null,
    loginUrl: 'https://music.163.com/#/login',
    init() {
        this.createWindow()
        this.loginWindow.loadURL(this.loginUrl)
    },
    // 创建窗口
    createWindow() {
        this.loginWindow = new remote.BrowserWindow({
            title: '绑定网易云账号',
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
                partition: Math.random().toString(),
            },
        })
        this.loginWindow.setMenu(null) // 去掉windows linux下的Menu
        this.initEvent()
    },
    // 初始化  事件
    initEvent() {
        const cookies = this.loginWindow.webContents.session.cookies
        cookies.on('changed', (event, cookie, cause) => {
            if (cookie.name === '__csrf') {
                cookies.get(
                    { url: 'https://music.163.com' },
                    async (error, cookies) => {
                        if (error) {
                            this.loginWindow.destroy()
                            Vue.$message.warning('获取登录状态失败')
                        } else {
                            this.loginWindow.destroy()
                            const cookieStr = cookies
                                .map(item => `${item.name}=${item.value}`)
                                .join('; ')
                            Vue.$store.commit('user/updateBind', {
                                vendor: 'netease',
                                value: {
                                    nickname: null,
                                    avatar: null,
                                    cookies: cookieStr,
                                },
                            })
                            Vue.$store.dispatch(
                                'user/checkNeteaseBindAvalible',
                                true
                            )
                        }
                    }
                )
            }
        })
    },
}
