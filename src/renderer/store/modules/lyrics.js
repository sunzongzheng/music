import Vue from 'vue'

export default {
    namespaced: true,
    state: {
        show: false,
        lyrics: [],
        translate: [],
        loading: false,
        activeIndex: 0,
        showTranslate: false
    },
    mutations: {
        update(state, val) {
            for (let i in val) {
                state[i] = val[i]
            }
        }
    },
    actions: {
        async init({commit}) {
            const playInfo = Vue.$store.state.play.info
            commit('update', {
                loading: true
            })
            const data = await Vue.$musicApi.getLyric(playInfo.vendor, playInfo.songId)
            commit('update', {
                lyrics: (data.status ? data.data.lyric : []).map(item => {
                    let arr = item[0].match(/^(\d+):(\d+).(\d+)$/)
                    if (arr) {
                        item[0] = parseInt(arr[1]) * 60 * 1000 + parseInt(arr[2]) * 1000 + parseInt(arr[3].padEnd(3, '0'))
                    }
                    return item
                }),
                translate: (data.status ? data.data.translate : []).map(item => {
                    let arr = item[0].match(/^(\d+):(\d+).(\d+)$/)
                    if (arr) {
                        item[0] = parseInt(arr[1]) * 60 * 1000 + parseInt(arr[2]) * 1000 + parseInt(arr[3].padEnd(3, '0'))
                    }
                    return item
                }),
                loading: false,
                activeIndex: 0
            })
        }
    },
    getters: {
        hasTranslation(state) {
            return Boolean(state.translate.length)
        }
    }
}
