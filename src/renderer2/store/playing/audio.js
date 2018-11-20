const audio = document.createElement('audio')
const events = {
    pause() {
        Vue.$store.commit('playing/audio/updatePause', true)
    },
    play() {
        Vue.$store.commit('playing/audio/updatePause', false)
    },
    loadstart() {
        Vue.$store.commit('playing/audio/updateLoading', true)
    },
    waiting: this.loadstart,
    seeking: this.loadstart,
    playing() {
        Vue.$store.commit('playing/audio/updateLoading', false)
    },
    canplay: this.playing,
    seeked: this.playing,
    timeupdate(a, b) {
        console.log(a, b)
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
        volume: 100,
    },
    mutations: {
        updatePause(state, value) {
            state.pause = value
        },
        updateLoading(state, value) {
            state.loading = value
        },
    },
    actions: {
        togglePause() {
            if (audio.paused) {
                audio.play()
            } else {
                audio.pause()
            }
        },
        setSrc(ctx, value) {
            audio.src = value
        },
    },
    getters: {},
}
