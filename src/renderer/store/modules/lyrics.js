import Vue from 'vue'

export default {
    namespaced: true,
    state: {
        show: false,
        lyrics: [],
        translate: [],
        loading: false,
        activeIndex: 0,
        showTranslate: false,
    },
    mutations: {
        update(state, val) {
            for (let i in val) {
                state[i] = val[i]
            }
        },
    },
    actions: {
        async init({ commit }) {
            const playInfo = Vue.$store.state.play.info
            commit('update', {
                loading: true,
            })
            const data = await Vue.$musicApi.getLyric(playInfo.vendor, playInfo.songId)
            const startsArr = new Array(6).fill(null).map(item => ['0:0.0', ' '])
            const endsArr = new Array(6).fill(null).map(item => ['99:99.0', ' '])
            const lyrics = data.status ? data.data.lyric : []
            const translate = data.status ? data.data.translate : []
            commit('update', {
                lyrics: (lyrics.length ? startsArr.concat(lyrics).concat(endsArr) : []).map(item => {
                    const lyric = [...item] // 避免污染startsArr,endsArr中的值
                    let arr = lyric[0].match(/^(\d+):(\d+).(\d+)$/)
                    if (arr) {
                        lyric[0] = parseInt(arr[1]) * 60 * 1000 + parseInt(arr[2]) * 1000 + parseInt(arr[3].padEnd(3, '0'))
                    }
                    return lyric
                }),
                translate: (translate.length ? startsArr.concat(translate).concat(endsArr) : []).map(item => {
                    let arr = item[0].match(/^(\d+):(\d+).(\d+)$/)
                    if (arr) {
                        item[0] = parseInt(arr[1]) * 60 * 1000 + parseInt(arr[2]) * 1000 + parseInt(arr[3].padEnd(3, '0'))
                    }
                    return item
                }),
                loading: false,
                activeIndex: 0,
            })
        },
    },
    getters: {
        hasTranslation(state) {
            return Boolean(state.translate.length)
        },
    },
}
