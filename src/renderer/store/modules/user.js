import { remote } from 'electron'
import fly from 'flyio'

const { app } = remote
const path = remote.require('path')

const defaultSetting = {
    linuxAutoUpdate: false, // linux下自动更新
    macStatusBar: true, // mac状态栏
    messageAlert: false, // 消息提示音
    quality: 128000, // 优先试听音质
    localSongsFolders: [ // 本地歌曲 扫描路径
        path.join(app.getPath('music'), '音乐湖'),
    ],
    bind: {
        netease: {
            nickname: null,
            avatar: null,
            cookies: null,
        },
        qq: {
            nickname: null,
            avatar: null,
            cookies: null,
        },
    },
}
let savedSetting = JSON.parse(localStorage.getItem('userSetting'))
if (savedSetting) {
    for (let i in defaultSetting) {
        if (typeof savedSetting[i] === 'undefined') {
            savedSetting[i] = defaultSetting[i]
        }
    }
} else {
    savedSetting = defaultSetting
}

const NETEASE_LOGIN_COOKIE = '@suen/music-api-netease-login-cookie'
const QQ_LOGIN_COOKIE = '@suen/music-api-qq-login-cookie'

const cacheSetting = (val) => {
    localStorage.setItem('userSetting', JSON.stringify(val))
    if (val.bind.netease.cookies) {
        localStorage.setItem(NETEASE_LOGIN_COOKIE, JSON.stringify(val.bind.netease.cookies))
    } else {
        localStorage.removeItem(NETEASE_LOGIN_COOKIE)
    }
    if (val.bind.qq.cookies) {
        localStorage.setItem(QQ_LOGIN_COOKIE, JSON.stringify(val.bind.qq.cookies))
    } else {
        localStorage.removeItem(QQ_LOGIN_COOKIE)
    }
}

export default {
    namespaced: true,
    state: {
        info: null,
        setting: savedSetting,
    },
    mutations: {
        update(state, val) {
            state.info = val
            if (val) {
                // 初始化
                Vue.$store.dispatch('playlist/init')
                Vue.$store.dispatch('socket/initChatHistory')
            } else {
                Vue.$store.commit('playlist/update', [])
                Vue.$store.commit('socket/update', {
                    chatHistory: [],
                })
                Vue.$socket.logout()
                if (Vue.$router.history.current.name === 'chat') {
                    Vue.$router.push('/')
                }
            }
        },
        updateSetting(state, val) {
            for (let i in val) {
                state.setting[i] = val[i]
            }
            cacheSetting(state.setting)
        },
        updateBind(state, { vendor, value }) {
            state.setting.bind[vendor] = value
            cacheSetting(state.setting)
        },
        unBind(state, vendor) {
            const bindinfo = state.setting.bind[vendor]
            for (let i in bindinfo) {
                bindinfo[i] = null
            }
            cacheSetting(state.setting)
        },
    },
    actions: {
        async init({ commit }) {
            const data = await Vue.$http.get('/user')
            commit('update', data)
        },
        logout({ commit }, msg = true) {
            commit('update', null)
            Vue.$store.commit('token/clear')
            msg && Vue.$message.success('退出成功')
        },
        // 检查更新
        async checkUpdate({ state }) {
            try {
                if (state.setting.linuxAutoUpdate) {
                    await Vue.$updater.checkForUpdatesAndNotify()
                } else {
                    const needUpdate = await Vue.$updater.checkUpdate()
                    if (needUpdate) {
                        // osx 或 windows 使用默认的更新
                        if (process.platform === 'darwin' || process.platform === 'win32') {
                            Vue.$updater.updateAvailableCallback()
                        } else {
                            Vue.$mainWindow.webContents.send('update-alert')
                        }
                    } else {
                        Vue.$message.success('您目前已经是最新版本')
                    }
                }
            } catch (e) {
                console.warn(e)
                Vue.$message.warning('检查更新失败')
            }
        },
        // 检查网易云绑定账号 登录状态
        async checkNeteaseBindAvalible({ getters, commit, state }, toastError = false) {
            if (getters.bind.netease) {
                const res = await fly.get('http://music.163.com', {}, {
                    headers: {
                        Host: 'music.163.com',
                        Referer: 'https://music.163.com/',
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36',
                        Cookie: state.setting.bind.netease.cookies,
                    },
                    rejectUnauthorized: false,
                })
                const profile = eval(`(${/GUser\s*=\s*([^;]+);/.exec(res.data)[1]})`)
                if (!profile.nickname && toastError) {
                    commit('unBind', 'netease')
                    Vue.$message.warning('获取登录状态失败')
                    return
                }
                commit('updateBind', {
                    vendor: 'netease',
                    value: {
                        nickname: profile.nickname,
                        avatar: profile.avatarUrl,
                        cookies: state.setting.bind.netease.cookies,
                    },
                })
            } else {
                commit('unBind', 'netease')
            }
        },
        // 检查QQ音乐绑定账号 登录状态
        async checkQQBindAvalible({ getters, commit, state }, toastError = false) {
            if (getters.bind.qq) {
                const data = await Vue.$musicApi.qq.getUserInfo()
                if (data.status) {
                    commit('updateBind', {
                        vendor: 'qq',
                        value: {
                            nickname: data.data.nickname,
                            avatar: data.data.face,
                            cookies: state.setting.bind.qq.cookies,
                        },
                    })
                } else {
                    commit('unBind', 'qq')
                    toastError && Vue.$message.warning('获取登录状态失败')
                }
            } else {
                commit('unBind', 'qq')
            }
        },
    },
    getters: {
        bind(state) {
            return {
                netease: Boolean(state.setting.bind.netease.cookies),
                qq: Boolean(state.setting.bind.qq.cookies),
            }
        },
    },
}
