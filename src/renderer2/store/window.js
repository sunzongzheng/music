import { remote } from 'electron'

export default {
    namespaced: true,
    state: {
        status: null, // normal: 正常; minimized: 最小化; hiden: 被隐藏; fullscreen: 全屏;
    },
    mutations: {
        updateStatus(state, status) {
            state.status = status
        },
        changeMode(state, mode) {
            state.mode = mode
        },
    },
    actions: {
        close({ commit }) {
            commit('updateStatus', 'hiden')
            Vue.$mainWindow.hide()
        },
        minimize({ commit }) {
            commit('updateStatus', 'minimized')
            Vue.$mainWindow.minimize()
        },
        fullscreen({ commit }) {
            commit('updateStatus', 'fullscreen')
            Vue.$mainWindow.setFullScreen(true)
        },
        leaveFullscreen({ commit }) {
            commit('updateStatus', 'normal')
            Vue.$mainWindow.setFullScreen(false)
        },
        // 精简模式
        simplify() {
            Vue.$mainWindow.setSize(320, 50)
            Vue.$mainWindow.center()
        },
        // 恢复普通模式
        backNormal() {
            Vue.$mainWindow.setSize(980, 650)
            Vue.$mainWindow.center()
        },
        // 显示右键菜单
        showContextMenu(contextItem, songList = [], append = []) {
            const store = Vue.$store
            const state = store.state
            const userInfo = state.user.info
            const online = state.user.playlist.online.list
            const offline = state.user.playlist.offline.list
            const collect = ({ type, id }) => store.dispatch(`user/playlist/${type}/collect`, id)
            const play = song => store.dispatch('audio/playSong', song)
            const menus = []
            if (!contextItem.cp) {
                menus.push({
                    label: '播放',
                    click: () => {
                        play({
                            info: contextItem,
                            playlist: songList,
                        })
                    },
                })
                menus.push({
                    type: 'separator',
                })
            }
            const addToPlaylistMenu = {
                label: '添加到',
                submenu: [],
            }
            if (!online.length && !offline.length) {
                addToPlaylistMenu.submenu.push({
                    label: '暂无歌单',
                    enabled: false,
                })
            } else {
                if (online.length) {
                    addToPlaylistMenu.submenu.push({
                        label: '云歌单',
                        enabled: false,
                    })
                    online.forEach(item => {
                        addToPlaylistMenu.submenu.push({
                            label: item.name,
                            click: () => {
                                collect({
                                    id: item.id,
                                    info: contextItem,
                                })
                            },
                        })
                    })
                    addToPlaylistMenu.submenu.push({
                        type: 'separator',
                    })
                }

            }
            if (!contextItem.fullpath) {
                if ((userInfo && playlist.length) || offline_playlist.length) {
                    if (userInfo && playlist.length) {
                        addToPlaylistMenu.submenu.push({
                            label: '云歌单',
                            enabled: false,
                        })
                        playlist.forEach(item => {
                            addToPlaylistMenu.submenu.push({
                                label: item.name,
                                click: () => {
                                    collect({
                                        id: item.id,
                                        info: contextItem,
                                    })
                                },
                            })
                        })
                        addToPlaylistMenu.submenu.push({
                            type: 'separator',
                        })
                    }
                    if (offline_playlist.length) {
                        addToPlaylistMenu.submenu.push({
                            label: '离线歌单',
                            enabled: false,
                        })
                        offline_playlist.forEach(item => {
                            addToPlaylistMenu.submenu.push({
                                label: item.name,
                                click: () => {
                                    collectOffline({
                                        id: item.id,
                                        info: contextItem,
                                    })
                                },
                            })
                        })
                    }
                } else {
                    addToPlaylistMenu.submenu.push({
                        label: '暂无歌单',
                        enabled: false,
                    })
                }
                menus.push(addToPlaylistMenu)
                menus.push({
                    label: '查看评论',
                    click: () => {
                        Vue.$router.push({
                            name: 'song.comments',
                            params: {
                                id: contextItem.songId,
                            },
                            query: {
                                vendor: contextItem.vendor,
                            },
                        })
                    },
                })
                menus.push({
                    label: '下载',
                    click: () => {
                        Vue.$store.dispatch('download/download', contextItem)
                    },
                })
                menus.push({
                    label: '分享',
                    click: () => {
                        Vue.$ipc.send('share', contextItem)
                    },
                })
            }
            remote.Menu.buildFromTemplate(menus.concat(append)).popup(Vue.$mainWindow)
        },
    },
}
