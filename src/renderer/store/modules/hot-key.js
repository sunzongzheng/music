import {cloneDeep} from 'lodash'

const meta = [
    {
        keyCode: 32,
        char: '空格',
        registerKey: 'Space'
    },
    {
        keyCode: 91,
        char: '⌘',
        registerKey: 'Command'
    },
    {
        keyCode: 18,
        char: process.platform === 'darwin' ? '⌥' : 'Alt',
        registerKey: 'Alt'
    },
    {
        keyCode: 17,
        char: process.platform === 'darwin' ? '⌃' : 'Control',
        registerKey: 'Control'
    },
    {
        keyCode: 16,
        char: process.platform === 'darwin' ? '⇧' : 'Shift',
        registerKey: 'Shift'
    },
    {
        keyCode: 9,
        char: 'Tab',
        registerKey: 'Tab'
    },
    {
        keyCode: 37,
        char: '←',
        registerKey: 'Left'
    },
    {
        keyCode: 38,
        char: '↑',
        registerKey: 'Up'
    },
    {
        keyCode: 39,
        char: '→',
        registerKey: 'Right'
    },
    {
        keyCode: 40,
        char: '↓',
        registerKey: 'Down'
    },
    {
        keyCode: 188,
        char: ',',
        registerKey: ','
    },
    {
        keyCode: 190,
        char: '.',
        registerKey: '.'
    },
    {
        keyCode: 191,
        char: '/',
        registerKey: '/'
    },
    {
        keyCode: 186,
        char: ';',
        registerKey: ';'
    },
    {
        keyCode: 222,
        char: '\'',
        registerKey: '\''
    },
    {
        keyCode: 219,
        char: '[',
        registerKey: '['
    },
    {
        keyCode: 221,
        char: ']',
        registerKey: ']'
    },
    {
        keyCode: 189,
        char: '-',
        registerKey: '-'
    },
    {
        keyCode: 187,
        char: '=',
        registerKey: '='
    },
    {
        keyCode: 192,
        char: '`',
        registerKey: '`'
    }
]
// 0 - 9
for (let i = 48; i <= 57; i++) {
    meta.push({
        keyCode: i,
        char: String.fromCharCode(i),
        registerKey: String.fromCharCode(i)
    })
}
// A - Z
for (let i = 65; i <= 90; i++) {
    meta.push({
        keyCode: i,
        char: String.fromCharCode(i),
        registerKey: String.fromCharCode(i)
    })
}

const CommandOrControl = process.platform === 'darwin' ? 'Command' : 'Control'
const defaultHotKey = [
    {
        name: '播放暂停',
        value: 'playPause',
        key: 'Space', // 'space'
        global: `Alt+${CommandOrControl}+Space`
    },
    {
        name: '上一首',
        value: 'last',
        key: `${CommandOrControl}+Left`,
        global: `Alt+${CommandOrControl}+Left`
    },
    {
        name: '下一首',
        value: 'next',
        key: `${CommandOrControl}+Right`,
        global: `Alt+${CommandOrControl}+Right`
    },
    {
        name: '音量加',
        value: 'volumeIncrease',
        key: `${CommandOrControl}+Up`,
        global: `Alt+${CommandOrControl}+Up`
    },
    {
        name: '音量减',
        value: 'volumeDecrease',
        key: `${CommandOrControl}+Down`,
        global: `Alt+${CommandOrControl}+Down`
    }
]
export default {
    namespaced: true,
    state: {
        hotKey: localStorage.hotKey ? JSON.parse(localStorage.hotKey) : cloneDeep(defaultHotKey),
        enableGlobal: Boolean(localStorage.enableGlobal) || false, // 是否全局可用
    },
    mutations: {
        updateHotKey(state, {index, type, val}) {
            state.hotKey[index][type] = val
            Vue.$ipc.send('register-hotKey', {
                hotKey: state.hotKey,
                enableGlobal: state.enableGlobal
            })
            localStorage.hotKey = JSON.stringify(state.hotKey)
        },
        resetHotKey(state) {
            state.hotKey = cloneDeep(defaultHotKey)
            state.enableGlobal = false
            Vue.$ipc.send('register-hotKey', {
                hotKey: state.hotKey,
                enableGlobal: state.enableGlobal
            })
            localStorage.hotKey = JSON.stringify(state.hotKey)
        },
        updateEnableGlobal(state, val) {
            state.enableGlobal = val
            Vue.$ipc.send('register-hotKey', {
                hotKey: state.hotKey,
                enableGlobal: state.enableGlobal
            })
            localStorage.enableGlobal = val
        }
    },
    getters: {
        // 所有可用的 keyCode
        availableKeyCode() {
            return meta.map(item => item.keyCode)
        },
        keyCode2RegisterKey() {
            const rs = {}
            meta.forEach(item => {
                rs[item.keyCode] = item.registerKey
            })
            return rs
        },
        registerKey2Char() {
            const rs = {}
            meta.forEach(item => {
                rs[item.registerKey] = item.char
            })
            return rs
        }
    }
}