import { remote } from 'electron'
import fly from 'flyio'

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
                cookies.get({ url: 'https://music.163.com' }, async (error, cookies) => {
                    if (error) {
                        this.loginWindow.destroy()
                        Vue.$message.warning('获取登录状态失败')
                    } else {
                        this.loginWindow.destroy()
                        const cookieStr = cookies.map(item => `${item.name}=${item.value}`).join('; ')
                        const res = await fly.get('http://music.163.com', {}, {
                            headers: {
                                Host: 'music.163.com',
                                Referer: 'https://music.163.com/',
                                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36',
                                Cookie: cookieStr,
                            },
                        })
                        const profile = eval(`(${/GUser\s*=\s*([^;]+);/.exec(res.data)[1]})`)
                        if (!profile.nickname) {
                            Vue.$message.warning('获取登录状态失败')
                            return
                        }
                        Vue.$store.commit('user/updateBind', {
                            vendor: 'netease',
                            value: {
                                nickname: profile.nickname,
                                avatar: profile.avatarUrl,
                                cookies: cookieStr,
                            },
                        })
                    }
                })
            }
        })
    },
}
