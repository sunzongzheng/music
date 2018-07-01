import Vue from 'vue'

export default {
    namespaced: true,
    state: {
        search: {
            keywords: '',
            loading: false,
        },
        play: {
            url: null,
            pause: true,
            volume: isNaN(localStorage.volume) ? 100 : parseInt(localStorage.volume),
            info: null
        }
    },
    mutations: {
        updateSearch(state, val) {
            for (let i in val) {
                state.search[i] = val[i]
            }
        },
        updatePlay(state, val) {
            for (let i in val) {
                state.play[i] = val[i]
            }
        },
        pauseChange(state) {
            state.play.pause = !state.play.pause
        }
    },
    actions: {
        async play({commit}, info) {
            // 首先检查ip
            try {
                const {data} = await Vue.clientApi('http://txt.go.sohu.com/ip/soip')
                const match = data.match(/sohu_IP_Loc_V="(.*?)"/)
                if (match && match[1].substr(0, 2) !== 'CN') {
                    console.log(match)
                    Vue.$message({
                        message: '当前ip来自海外,请检查是否使用了vpn,部分音乐可能无法播放',
                        duration: 5000,
                        type: 'warning'
                    })
                }
            } catch (e) {
                console.warn(e)
            }
            commit('updatePlay', {
                info,
                pause: true
            })
            let data = await Vue.api.getSongUrl(info.vendor, info.songId)
            if (data.status) {
                Vue.store.dispatch('lyrics/init')
                let url = data.data.url
                if (url) {
                    url = url.startsWith('http') ? url : ('http://' + url)
                }
                commit('updatePlay', {
                    url,
                    pause: false
                })
            } else {
                console.log(data)
                Vue.$message.warning(data.msg)
            }
        }
    }
}
