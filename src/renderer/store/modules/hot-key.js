import { cloneDeep } from 'lodash'
import eventBus from '../../eventBus/searchResult'
import { remote } from 'electron'

const { globalShortcut } = remote

const systemGlobalShortcut = [
    {
        name: '播放暂停',
        value: 'playPause',
        global: `MediaPlayPause`,
    },
    {
        name: '上一首',
        value: 'last',
        global: `MediaPreviousTrack`,
    },
    {
        name: '下一首',
        value: 'next',
        global: `MediaNextTrack`,
    },
]

const meta = [
    {
        keyCode: 32,
        char: '空格',
        registerKey: 'Space',
    },
    {
        keyCode: 91,
        char: '⌘',
        registerKey: 'Command',
    },
    {
        keyCode: 18,
        char: process.platform === 'darwin' ? '⌥' : 'Alt',
        registerKey: 'Alt',
    },
    {
        keyCode: 17,
        char: process.platform === 'darwin' ? '⌃' : 'Control',
        registerKey: 'Control',
    },
    {
        keyCode: 16,
        char: process.platform === 'darwin' ? '⇧' : 'Shift',
        registerKey: 'Shift',
    },
    {
        keyCode: 9,
        char: 'Tab',
        registerKey: 'Tab',
    },
    {
        keyCode: 37,
        char: '←',
        registerKey: 'Left',
    },
    {
        keyCode: 38,
        char: '↑',
        registerKey: 'Up',
    },
    {
        keyCode: 39,
        char: '→',
        registerKey: 'Right',
    },
    {
        keyCode: 40,
        char: '↓',
        registerKey: 'Down',
    },
    {
        keyCode: 188,
        char: ',',
        registerKey: ',',
    },
    {
        keyCode: 190,
        char: '.',
        registerKey: '.',
    },
    {
        keyCode: 191,
        char: '/',
        registerKey: '/',
    },
    {
        keyCode: 186,
        char: ';',
        registerKey: ';',
    },
    {
        keyCode: 222,
        char: '\'',
        registerKey: '\'',
    },
    {
        keyCode: 219,
        char: '[',
        registerKey: '[',
    },
    {
        keyCode: 221,
        char: ']',
        registerKey: ']',
    },
    {
        keyCode: 189,
        char: '-',
        registerKey: '-',
    },
    {
        keyCode: 187,
        char: '=',
        registerKey: '=',
    },
    {
        keyCode: 192,
        char: '`',
        registerKey: '`',
    },
]
// 0 - 9
for (let i = 48; i <= 57; i++) {
    meta.push({
        keyCode: i,
        char: String.fromCharCode(i),
        registerKey: String.fromCharCode(i),
    })
}
// A - Z
for (let i = 65; i <= 90; i++) {
    meta.push({
        keyCode: i,
        char: String.fromCharCode(i),
        registerKey: String.fromCharCode(i),
    })
}

const CommandOrControl = process.platform === 'darwin' ? 'Command' : 'Control'
const defaultHotKey = [
    {
        name: '播放暂停',
        value: 'playPause',
        key: 'Alt+Space',
        global: `Alt+${CommandOrControl}+Space`,
    },
    {
        name: '上一首',
        value: 'last',
        key: `${CommandOrControl}+Left`,
        global: `Alt+${CommandOrControl}+Left`,
    },
    {
        name: '下一首',
        value: 'next',
        key: `${CommandOrControl}+Right`,
        global: `Alt+${CommandOrControl}+Right`,
    },
    {
        name: '音量加',
        value: 'volumeIncrease',
        key: `${CommandOrControl}+Up`,
        global: `Alt+${CommandOrControl}+Up`,
    },
    {
        name: '音量减',
        value: 'volumeDecrease',
        key: `${CommandOrControl}+Down`,
        global: `Alt+${CommandOrControl}+Down`,
    },
    {
        name: '播放模式切换',
        value: 'playModeChange',
        key: `${CommandOrControl}+/`,
        global: `Alt+${CommandOrControl}+/`,
    },
    {
        name: '快速定位搜索框',
        value: 'pointSearchBar',
        key: `${CommandOrControl}+F`,
        global: `Alt+${CommandOrControl}+F`,
    },
]

let hotKey = cloneDeep(defaultHotKey)
if (localStorage.hotKey) {
    const saved = JSON.parse(localStorage.hotKey)
    const savedObject = {}
    saved.forEach(item => {
        savedObject[item.value] = item
    })
    hotKey = hotKey.map(item => {
        if (savedObject[item.value]) {
            return savedObject[item.value]
        }
        return item
    })
}
export default {
    namespaced: true,
    state: {
        hotKey,
        enableGlobal: Boolean(JSON.parse(localStorage.enableGlobal || false)), // 是否全局可用
    },
    mutations: {
        updateHotKey(state, { index, type, val }) {
            state.hotKey[index][type] = val
            Vue.$store.dispatch('menu/init')
            localStorage.hotKey = JSON.stringify(state.hotKey)
        },
        resetHotKey(state) {
            state.hotKey = cloneDeep(defaultHotKey)
            localStorage.hotKey = JSON.stringify(state.hotKey)
        },
        updateEnableGlobal(state, val) {
            state.enableGlobal = val
            if (val) {
                systemGlobalShortcut.concat(state.hotKey).forEach(single => {
                    const res = globalShortcut.register(single.global, () => {
                        Vue.$store.dispatch('hot-key/hotKeyControl', single.value)
                    })
                    if (res) {
                        console.log(`${single.global}注册成功`)
                    } else {
                        console.log(`${single.global}注册失败`)
                    }
                })
            } else {
                state.hotKey.forEach(single => {
                    globalShortcut.unregister(single.global)
                })
            }
            localStorage.enableGlobal = JSON.stringify(val)
        },
    },
    actions: {
        // 快捷键控制
        hotKeyControl(store, key) {
            const { commit, dispatch, state } = Vue.$store
            switch (key) {
                case 'playPause':
                    commit('play/pauseChange')
                    break
                case 'last':
                    dispatch('c_playlist/last')
                    break
                case 'next':
                    dispatch('c_playlist/next')
                    break
                case 'volumeIncrease':
                    commit('play/volumeIncrease')
                    break
                case 'volumeDecrease':
                    commit('play/volumeDecrease')
                    break
                case 'playModeChange':
                    commit('c_playlist/cycleChange')
                    const text = {
                        list: '列表循环',
                        random: '随机播放',
                        single: '单曲循环',
                    }[state.c_playlist.cycle]
                    const notification = new Notification('播放模式切换', {
                        body: text,
                    })
                    setTimeout(() => {
                        notification.close()
                    }, 2000)
                    break
                case 'pointSearchBar':
                    Vue.$mainWindow.show()
                    eventBus.$emit('focus')
            }
        },
        initGlobalShortcut({state, commit}) {
            commit('updateEnableGlobal', state.enableGlobal)
        },
        reset({ commit }) {
            commit('resetHotKey')
            commit('updateEnableGlobal', false)
            Vue.$store.dispatch('menu/init')
        },
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
        },
    },
}