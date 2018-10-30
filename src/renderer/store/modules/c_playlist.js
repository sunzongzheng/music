import Vue from 'vue'
import { shuffle } from 'lodash'

export default {
    namespaced: true,
    state: {
        playlist: [],
        show: false,
        cycle: localStorage.cycle ? localStorage.cycle : 'list', // list: 列表循环; random: 随机; single: 单曲,
        shuffleList: [], // 打乱后的数组 用于随机
    },
    mutations: {
        update(state, val) {
            state.playlist = val.filter(item => !item.cp).map(item => Object.freeze(item))
            // 更换列表时如果当前是随机模式 则立即生成
            if (state.cycle === 'random') {
                state.shuffleList = shuffle(state.playlist)
            }
        },
        toggle(state) {
            state.show = !state.show
        },
        cycleChange(state) {
            let arr = ['list', 'single', 'random']
            arr.every((item, index) => {
                if (item === state.cycle) {
                    state.cycle = arr[(index + 1) % 3]
                    // 每次切到随机 都会重新生成
                    if (state.cycle === 'random') {
                        state.shuffleList = shuffle(state.playlist)
                    } else {
                        state.shuffleList = []
                    }
                    localStorage.cycle = state.cycle
                    return false
                } else {
                    return true
                }
            })
        },
        remove(state, index) {
            // 如果当前为随机模式 也从随机列表中删除
            if (state.cycle === 'random') {
                const info = state.playlist[index]
                for (let i in state.shuffleList) {
                    const item = state.shuffleList[i]
                    if (item.songId === info.songId && item.vendor === info.vendor) {
                        state.shuffleList.splice(i, 1)
                        break
                    }
                }
            }
            state.playlist.splice(index, 1)
        },
        clear(state) {
            state.playlist = state.shuffleList = []
            Vue.$store.commit('play/clear')
        },
    },
    actions: {
        last({ state, commit, getters }, auto = false) {
            if (state.playlist.length) {
                let index = getters.playingIndex
                switch (state.cycle) {
                    case 'single':
                        // 自动切换 播放当前歌曲; 手动切换 跟随list模式
                        if (auto) {
                            break
                        }
                    case 'list':
                        index = (index + state.playlist.length - 1) % state.playlist.length
                        break
                    case 'random':
                        index = (getters.playingShuffleIndex + state.shuffleList.length - 1) % state.shuffleList.length
                        Vue.$store.dispatch('play/play', {
                            info: state.shuffleList[index],
                        })
                        return
                }
                Vue.$store.dispatch('play/play', {
                    info: state.playlist[index],
                })
            }
        },
        next({ state, commit, getters }, auto = false) {
            if (state.nextPlay) {
                Vue.$store.dispatch('play/play', {
                    info: state.nextPlay,
                })
                return
            }
            if (state.playlist.length) {
                let index = getters.playingIndex
                switch (state.cycle) {
                    case 'single':
                        // 自动切换 播放当前歌曲; 手动切换 跟随list模式
                        if (auto) {
                            break
                        }
                    case 'list':
                        index = (index + state.playlist.length + 1) % state.playlist.length
                        break
                    case 'random':
                        index = (getters.playingShuffleIndex + 1) % state.shuffleList.length
                        Vue.$store.dispatch('play/play', {
                            info: state.shuffleList[index],
                        })
                        return
                }
                Vue.$store.dispatch('play/play', {
                    info: state.playlist[index],
                })
            }
        },
        remove({ state, commit, dispatch }, index) {
            const playInfo = Vue.$store.state.play.info
            const removeInfo = state.playlist[index]
            if (removeInfo.songId === playInfo.songId && removeInfo.vendor === playInfo.vendor) {
                if (state.playlist.length > 1) {
                    commit('remove', index)
                    dispatch('next')
                } else {
                    commit('clear')
                }
            } else {
                commit('remove', index)
            }
        },
    },
    getters: {
        playingIndex(state) {
            const cur = Vue.$store.state.play.info
            for (let i = 0; i < state.playlist.length; i++) {
                const item = state.playlist[i]
                if (item.id && item.vendor && item.id === cur.id && item.vendor === cur.vendor || (cur.fullpath && cur.fullpath === item.fullpath)) {
                    return i
                }
            }
            return -1
        },
        playingShuffleIndex(state) {
            const cur = Vue.$store.state.play.info
            for (let i = 0; i < state.shuffleList.length; i++) {
                const item = state.shuffleList[i]
                if (item.id && item.vendor && item.id === cur.id && item.vendor === cur.vendor || (cur.fullpath && cur.fullpath === item.fullpath)) {
                    return i
                }
            }
            return -1
        },
    },
}
