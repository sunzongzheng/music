import Vue from 'vue'

export default {
    namespaced: true,
    state: {
        show: false,
        lyrics: [],
        loading: false,
        activeIndex: 0
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
                lyrics: (data.status ? data.data : []).map(item => {
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
    }
}
