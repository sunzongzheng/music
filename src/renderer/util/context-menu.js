import { remote } from 'electron'

export default {
    song(contextItem, songList = [], append = []) {
        const store = Vue.$store
        const state = store.state
        const commit = store.commit
        const userInfo = state.user.info
        const playlist = state.playlist.playlist
        const offline_playlist = state['offline-playlist'].offline_playlist
        const collect = $event => store.dispatch('playlist/collect', $event)
        const collectOffline = $event => store.dispatch('offline-playlist/collect', $event)
        const play = $event => store.dispatch('play/play', $event)
        const menus = [
            {
                label: '播放',
                click: () => {
                    play({
                        info: contextItem,
                        playlist: songList,
                    })
                },
            },
            {
                type: 'separator',
            },
        ]
        if (!contextItem.fullpath) {
            const playlistMenu = {
                label: '添加到',
                submenu: [],
            }
            if ((userInfo && playlist.length) || offline_playlist.length) {
                if (userInfo && playlist.length) {
                    playlistMenu.submenu.push({
                        label: '云歌单',
                        enabled: false,
                    })
                    playlist.forEach(item => {
                        playlistMenu.submenu.push({
                            label: item.name,
                            click: () => {
                                collect({
                                    id: item.id,
                                    info: contextItem,
                                })
                            },
                        })
                    })
                    playlistMenu.submenu.push({
                        type: 'separator',
                    })
                }
                if (offline_playlist.length) {
                    playlistMenu.submenu.push({
                        label: '离线歌单',
                        enabled: false,
                    })
                    offline_playlist.forEach(item => {
                        playlistMenu.submenu.push({
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
                playlistMenu.submenu.push({
                    label: '暂无歌单',
                    enabled: false,
                })
            }
            menus.push(playlistMenu)
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
        remote.Menu.buildFromTemplate(menus.concat(append)).popup(remote.getCurrentWindow())
    },
}