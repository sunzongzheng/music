import {Menu, ipcMain, globalShortcut, app} from 'electron'

const template = [
    {
        label: 'Music',
        submenu: [
            {
                label: '打开控制台',
                click() {
                    global.mainWindow.webContents.openDevTools({detach: true})
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

ipcMain.on('register-hotKey', (event, {hotKey, enableGlobal}) => {
    globalShortcut.unregisterAll()
    const submenu = []
    hotKey.forEach(single => {
        submenu.push({
            label: single.name,
            accelerator: single.key,
            click: () => {
                event.sender.send('hotKey-control', single.value)
            }
        })
        if (enableGlobal) {
            const res = globalShortcut.register(single.global, () => {
                event.sender.send('hotKey-control', single.value)
            })
            if (res) {
                console.log(`${single.global}注册成功`)
            } else {
                console.log(`${single.global}注册失败`)
            }
        }
    })
    if (!enableGlobal) {
        globalShortcut.unregisterAll()
    }
    if (template[2]) {
        template[2].submenu = submenu
    } else {
        template.push({
            label: '控制',
            submenu
        })
    }
    initMenu()
})
export default function initMenu() {
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}