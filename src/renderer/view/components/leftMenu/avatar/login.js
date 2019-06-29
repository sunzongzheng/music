import { remote } from 'electron'

export default class Login {
    win = null

    constructor(url, loginWithBrowser = false) {
        if (loginWithBrowser) {
            remote.shell.openExternal(url + '?open_client=true')
        } else {
            this.createWindow()
            this.win.loadURL(url)
            this.win.show()
        }
    }

    createWindow() {
        this.win = new remote.BrowserWindow({
            title: '授权登录',
            parent: Vue.$mainWindow,
            height: 600,
            resizable: false,
            width: 750,
            frame: true,
            fullscreen: false,
            maximizable: false,
            minimizable: false,
            autoHideMenuBar: true,
        })
        // this.win.webContents.openDevTools()
        this.win.setMenu(null) // 去掉windows linux下的Menu
        this.initEvent()
    }

    initEvent() {
        this.win.webContents.on('did-navigate', async (event, url) => {
            const _url = new URL(url)
            if (_url.searchParams.get('code')) {
                this.win.webContents.session.cookies.get(
                    {
                        domain: _url.hostname,
                        name: 'accesstoken',
                    },
                    (error, cookies) => {
                        this.win.destroy()
                        if (error) {
                            Vue.$message.warning('登录失败')
                        } else if (cookies.length) {
                            Vue.$store.commit('token/update', cookies[0].value)
                            Vue.$store.dispatch('user/init')
                        }
                    }
                )
            }
        })
    }
}
