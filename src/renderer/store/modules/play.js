import Vue from 'vue'
import { remote } from 'electron'

const fs = remote.require('fs')
export default {
    namespaced: true,
    state: {
        url: null,
        pause: true,
        volume: isNaN(localStorage.volume) ? 100 : parseInt(localStorage.volume),
        info: null,
        quality: 128000,
    },
    mutations: {
        update(state, val) {
            for (let i in val) {
                state[i] = val[i]
            }
        },
        pauseChange(state) {
            if (state.url) {
                state.pause = !state.pause
            }
        },
        updateVolume(state, val) {
            state.volume = val
            Vue.$ipc.send('tray-control-volume', val)
        },
        volumeIncrease(state) {
            state.volume = state.volume + 10 > 100 ? 100 : state.volume + 10
        },
        volumeDecrease(state) {
            state.volume = state.volume - 10 < 0 ? 0 : state.volume - 10
        },
        clear(state) {
            state.url = null
            state.pause = true
            state.info = null
            Vue.$store.commit('lyrics/update', {
                show: false,
            })
        },
    },
    actions: {
        async play({ commit }, {
            info,
            playlist = null,
        }) {
            // 有本地文件 直接播放本地文件
            if (info.fullpath) {
                if (playlist) {
                    Vue.$store.commit('c_playlist/update', playlist)
                }
                commit('update', {
                    pause: true,
                    info,
                })
                setTimeout(() => {
                    commit('update', {
                        url: `file://${info.fullpath}`,
                        pause: false,
                        quality: info.bitrate,
                    })
                })
            } else {
                if (info.cp) {
                    Vue.$message.warning('歌曲无法试听')
                    return
                }
                if (playlist) {
                    Vue.$store.commit('c_playlist/update', playlist)
                }
                commit('update', {
                    info,
                    pause: true,
                })
                console.log(info)
                // 首先检查ip
                try {
                    const { data } = await Vue.$clientApi('http://txt.go.sohu.com/ip/soip')
                    const match = data.match(/sohu_IP_Loc_V="(.*?)"/)
                    if (match && match[1].substr(0, 2) !== 'CN') {
                        console.log(match)
                        Vue.$message({
                            message: '当前ip来自海外,请检查是否使用了vpn,部分音乐可能无法播放',
                            duration: 5000,
                            type: 'warning',
                        })
                    }
                } catch (e) {
                    console.warn(e)
                }
                let quality = 128000
                const priority = Vue.$store.state.user.setting.quality / 1000
                if (priority > 128 && info.quality) {
                    if (info.quality[priority]) {
                        quality = Vue.$store.state.user.setting.quality
                    } else {
                        // 降级
                        const qualities = [320, 192]
                        for (let item of qualities) {
                            if (info.quality[item]) {
                                quality = item * 1000
                                break
                            }
                        }
                    }
                }
                let data = await Vue.$musicApi.getSongUrl(
                    info.vendor,
                    info.songId,
                    quality,
                )
                if (data.status) {
                    Vue.$store.dispatch('lyrics/init')
                    let url = data.data.url
                    if (url) {
                        url = url.startsWith('http') ? url : ('http://' + url)
                    }
                    commit('update', {
                        url,
                        pause: false,
                        quality,
                    })
                } else {
                    console.log(data)
                    Vue.$message.warning(data.msg)
                }
            }
        },
        playAll({ dispatch }, list) {
            const songs = list.filter(item => !item.cp)
            if (!songs.length) {
                Vue.$message.warning('暂无可试听歌曲')
                return
            }
            const cycle = Vue.$store.state.c_playlist.cycle
            if (cycle === 'random') {
                const index = parseInt(Math.random() * (songs.length - 1), 10) + 1
                dispatch('play', {
                    info: songs[index],
                    playlist: songs,
                })
            } else {
                dispatch('play', {
                    info: songs[0],
                    playlist: songs,
                })
            }
        },
    },
    getters: {
        hasHigherQuality(state) {
            return state.info && state.info.quality && (state.info.quality['192'] || state.info.quality['320'] || state.info.quality['999'])
        },
    },
}
