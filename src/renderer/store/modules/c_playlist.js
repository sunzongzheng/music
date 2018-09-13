import Vue from 'vue'

export default {
    namespaced: true,
    state: {
        playlist: [],
        show: false,
        cycle: localStorage.cycle ? localStorage.cycle : 'list', // list: 列表循环; random: 随机; single: 单曲,
        nextPlay: null
    },
    mutations: {
        update(state, val) {
            state.playlist = val.filter(item => !item.cp).map(item => Object.freeze(item))
        },
        toggle(state) {
            state.show = !state.show
        },
        cycleChange(state) {
            let arr = ['list', 'single', 'random']
            arr.every((item, index) => {
                if (item === state.cycle) {
                    state.cycle = arr[(index + 1) % 3]
                    localStorage.cycle = state.cycle
                    return false
                } else {
                    return true
                }
            })
        },
        updateNextPlay(state, val) {
            if (val) {
                if (state.playlist.filter(item => item.songId === val.songId && item.vendor === val.vendor).length) {
                    Vue.$message.warning('播放列表已存在')
                } else if (val.cp) {
                    Vue.$message.warning('歌曲无法试听')
                } else {
                    state.playlist = state.playlist.concat([val]).map(item => Object.freeze(item))
                    Vue.$message.success('添加成功')
                }
            }
            state.nextPlay = val
        },
        remove(state, index) {
            state.playlist.splice(index, 1)
        },
        clear(state) {
            state.playlist = []
            Vue.$store.commit('play/clear')
        }
    },
    actions: {
        last({state}) {
            if (state.playlist.length) {
                const cur = Vue.$store.state.play.info
                let index = -1
                state.playlist.forEach((item, i) => {
                    if (item.id === cur.id && item.vendor === cur.vendor) {
                        console.log(i)
                        index = i
                    }
                })
                switch (state.cycle) {
                    case 'list':
                        index = (index + state.playlist.length - 1) % state.playlist.length
                        break
                    case 'random':
                        const copy = index // 副本
                        index = parseInt(Math.random() * (state.playlist.length - 1), 10) + 1
                        if (index === copy) { // 如果随机以后和原本一样，再随机一次
                            index = parseInt(Math.random() * (state.playlist.length - 1), 10) + 1
                        }
                        break
                }
                Vue.$store.dispatch('play/play', {
                    info: state.playlist[index]
                })
            }
        },
        next({state, commit}) {
            if (state.nextPlay) {
                Vue.$store.dispatch('play/play', {
                    info: state.nextPlay
                })
                commit('updateNextPlay', null)
                return
            }
            if (state.playlist.length) {
                const cur = Vue.$store.state.play.info
                let index = -1
                state.playlist.forEach((item, i) => {
                    if (item.id === cur.id && item.vendor === cur.vendor) {
                        index = i
                    }
                })
                switch (state.cycle) {
                    case 'list':
                        index = (index + state.playlist.length + 1) % state.playlist.length
                        break
                    case 'random':
                        index = parseInt(Math.random() * (state.playlist.length - 1), 10) + 1
                }
                Vue.$store.dispatch('play/play', {
                    info: state.playlist[index]
                })
            }
        },
        remove({state, commit, dispatch}, index) {
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
    }
}
