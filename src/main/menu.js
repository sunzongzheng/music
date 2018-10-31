import { Menu, globalShortcut, app } from 'electron'

const template = [
    {
        label: 'Music',
        submenu: [
            {
                label: '打开控制台',
                click() {
                    global.mainWindow.webContents.openDevTools({ mode: 'detach' })
                }
            },
            {
                label: '关于',
                click() {
                    require('electron').shell.openExternal('https://github.com/sunzongzheng/music')
                }
            },
            {
                label: '退出音乐湖',
                accelerator: 'CommandOrControl+Q',
                click: () => {
                    global.mainWindow = null
                    app.exit()
                }
            }
        ]
    },
    {
        label: '编辑',
        submenu: [
            {role: 'undo', label: '撤销'},
            {role: 'redo', label: '重做'},
            {type: 'separator'},
            {role: 'cut', label: '剪贴'},
            {role: 'copy', label: '拷贝'},
            {role: 'paste', label: '粘贴'},
            {role: 'delete', label: '删除'},
            {role: 'selectall', label: '全选'}
        ]
    }
]
export default function initMenu() {
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
    // 设置一个复杂的组合键打开控制台 方便调试
    const res = globalShortcut.register('Control+Q+W+E+R', () => {
        global.mainWindow.webContents.openDevTools({ mode: 'detach' })
    })
    if (res) {
        console.log(`控制台组合键注册成功`)
    } else {
        console.log(`控制台组合键注册失败`)
    }
}