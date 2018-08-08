import {Menu} from 'electron'

export default function initMenu() {
    const template = [
        {
            label: 'Music',
            submenu: [
                {
                    label: '关于',
                    click() {
                        require('electron').shell.openExternal('https://github.com/sunzongzheng/music')
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
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
}