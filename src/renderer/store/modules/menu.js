import { remote } from 'electron'

const { Menu, app, shell } = remote

export default {
    namespaced: true,
    state: {
        staticMenu: [
            {
                label: 'Music',
                submenu: [
                    {
                        label: '打开控制台',
                        click() {
                            Vue.$mainWindow.webContents.openDevTools({ mode: 'detach' })
                        },
                    },
                    
                    {
                        label: '关于',
                        click() {
                            shell.openExternal('https://github.com/sunzongzheng/music')
                        },
                    },
                    {
                        label: '偏好设置',
                        accelerator: 'CommandOrControl+,',
                        click: () => {
                            Vue.$router.push('/setting')
                        },
                    },
                    {
    					label: '关闭窗口',
    					accelerator: 'CommandOrControl+W',
    					click: () => {
        					Vue.$mainWindow.hide()
    					}
					},
					{
    					label: '隐藏窗口',
    					accelerator: 'CommandOrControl+H',
    					click: () => {
        					Vue.$mainWindow.hide()
    					}
					},
                    {
                        label: '退出音乐湖',
                        accelerator: 'CommandOrControl+Q',
                        click: () => {
                            Vue.$mainWindow = null
                            app.exit()
                        },
                    }
                    
                ],
            },
            {
                label: '编辑',
                submenu: [
                    { role: 'undo', label: '撤销' },
                    { role: 'redo', label: '重做' },
                    { type: 'separator' },
                    { role: 'cut', label: '剪贴' },
                    { role: 'copy', label: '拷贝' },
                    { role: 'paste', label: '粘贴' },
                    { role: 'delete', label: '删除' },
                    { role: 'selectall', label: '全选' },
                ],
            },
        ],
    },
    actions: {
        init({ getters }) {
            Menu.setApplicationMenu(Menu.buildFromTemplate(getters.menu))
        },
    },
    getters: {
        menu(state) {
            const hotKey = Vue.$store.state['hot-key'].hotKey
            const submenu = []
            hotKey.forEach(single => {
                submenu.push({
                    label: single.name,
                    accelerator: single.key,
                    click: () => {
                        Vue.$store.dispatch('hot-key/hotKeyControl', single.value)
                    },
                })
            })
            return state.staticMenu.concat({
                label: '控制',
                submenu,
            })
        },
    },
}
