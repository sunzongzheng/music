const audio = document.createElement('audio')
audio.preload = true
const commit = (event, payload) => {
    Vue.$store.commit(`audio/${event}`, payload)
}
const events = {
    pause() {
        commit('updatePause', true)
    },
    play() {
        commit('updatePause', false)
    },
    loadstart() {
        commit('updateLoading', true)
    },
    waiting() {
        commit('updateLoading', true)
    },
    seeking() {
        commit('updateLoading', true)
    },
    playing() {
        commit('updateLoading', false)
    },
    canplay() {
        commit('updateLoading', false)
        commit('updateDuration', audio.duration)
    },
    seeked() {
        commit('updateLoading', false)
    },
    ended() {
        Vue.$store.dispatch(`playing/next`)
    },
}
Object.entries(events).forEach(event => {
    audio.addEventListener(event[0], event[1])
})

export default {
    namespaced: true,
    state: {
        audio,
        pause: true,
        loading: false,
        duration: 0,
        volume: JSON.parse(localStorage.getItem('volume')) || 100,
    },
    mutations: {
        updatePause(state, value) {
            state.pause = value
        },
        updateLoading(state, value) {
            state.loading = value
        },
        updateDuration(state, val) {
            state.duration = val
        },
        updateVolume(state, val) {
            state.volume = val
            audio.volume = val / 100
            localStorage.setItem('volume', JSON.stringify(val))
        },
    },
    actions: {
        togglePause() {
            if (!audio.src) return
            if (audio.paused) {
                audio.play()
            } else {
                audio.pause()
            }
        },
        async play({ state }, index) {
            audio.pause() // 先暂停当前的
            const playingState = Vue.$store.state.playing
            const song = playingState.list[index]
            Vue.$store.commit('playing/setIndex', index)
            if (song.filepath) {
                audio.src = `file://${song.filepath}`
                audio.play()
            } else {
                const songUrl = await Vue.$musicApi.getSongUrl(
                    song.vendor,
                    song.songId
                ) // 获取url
                if (songUrl.status) {
                    audio.src = songUrl.data.url
                    audio.play()
                } else {
                    Vue.$message.warning(songUrl.msg)
                }
            }
        },
        // 播放单曲
        async playSong({ dispatch }, song) {
            const index = await Vue.$store.dispatch('playing/addSong', song) // 更新歌曲信息
            dispatch('play', index)
        },
        // 播放列表
        playList({ dispatch }, { list = [], index = 0 }) {
            const _list = list.filter(item => !item.cp)
            if (_list.length < 1) {
                Vue.$message.warning('没有可播放的歌曲')
                return
            }
            Vue.$store.commit('playing/setList', _list)
            dispatch('play', index)
        },
    },
    getters: {},
}
