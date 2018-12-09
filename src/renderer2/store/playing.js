import { shuffle } from 'lodash'

const list = JSON.parse(localStorage.getItem('playing/list')) || []
const randomList = shuffle(
    Array.from(new Array(list.length), (item, index) => index)
)
export default {
    namespaced: true,
    state: {
        list,
        randomList,
        index:
            localStorage.getItem('playing/index') === null
                ? -1
                : JSON.parse(localStorage.getItem('playing/index')),
        showPlaylist: false,
        cycle: JSON.parse(localStorage.getItem('playing/cycle')) || 'list', // list single random
    },
    mutations: {
        addSong(state, song) {
            state.list.push(Object.freeze(song))
        },
        setIndex(state, index) {
            state.index = index
            localStorage.setItem('playing/index', JSON.stringify(index))
        },
        setList(state, list) {
            state.list = list.map(item => Object.freeze(item))
            localStorage.setItem('playing/list', JSON.stringify(list))
            if (state.cycle === 'random') {
                state.randomList = shuffle(
                    Array.from(
                        new Array(state.list.length),
                        (item, index) => index
                    )
                )
            }
        },
        setRandomList(state, list) {
            state.randomList = list
        },
        setShowPlaylist(state, val) {
            state.showPlaylist = val
        },
        setCycle(state, val) {
            state.cycle = val
            localStorage.setItem('playing/cycle', JSON.stringify(val))
        },
    },
    actions: {
        toggleShowPlaylist({ commit, state }) {
            commit('setShowPlaylist', !state.showPlaylist)
        },
        addSong({ commit, state }, song) {
            for (let i = 0; i < state.list.length; i++) {
                const item = state.list[i]
                if (
                    item.vendor === song.vendor &&
                    item.songId === song.songId
                ) {
                    return i
                }
            }
            commit('addSong', song)
            return state.list.length - 1
        },
        next({ commit, state, getters }, manually = false) {
            if (getters.calcIndex < 0) return
            let index
            switch (state.cycle) {
                case 'single':
                    if (!manually) {
                        index = getters.calcIndex
                        break
                    }
                case 'random':
                case 'list':
                    const maxLength = state.list.length
                    index = (getters.calcIndex + 1) % maxLength
                    break
            }
            Vue.$store.dispatch(
                'audio/play',
                state.cycle === 'random' ? getters.randomToOrder[index] : index
            )
        },
        last({ commit, state, getters }) {
            if (getters.calcIndex < 0) return
            let index
            switch (state.cycle) {
                case 'single':
                case 'random':
                case 'list':
                    const maxLength = state.list.length
                    index = (getters.calcIndex - 1 + maxLength) % maxLength
                    break
            }
            Vue.$store.dispatch(
                'audio/play',
                state.cycle === 'random' ? getters.randomToOrder[index] : index
            )
        },
        toggleCycle({ commit, state }) {
            const list = ['list', 'single', 'random']
            const index = (list.indexOf(state.cycle) + 1) % list.length
            if (list[index] === 'random') {
                const randomList = shuffle(
                    Array.from(
                        new Array(state.list.length),
                        (item, index) => index
                    )
                )
                commit('setRandomList', randomList)
            }
            commit('setCycle', list[index])
        },
    },
    getters: {
        song(state) {
            return state.index < 0 ? null : state.list[state.index]
        },
        // 随机列表 对应 顺序列表 的索引
        randomToOrder(state) {
            const rs = {}
            state.randomList.forEach((item, index) => {
                rs[index] = item
            })
            return rs
        },
        // 当前播放的歌曲 在随机列表中的下标
        randomIndex(state) {
            return state.randomList.indexOf(state.index)
        },
        // 用于计算的下标
        calcIndex(state, getters) {
            return state.cycle === 'random' ? getters.randomIndex : state.index
        },
    },
}
