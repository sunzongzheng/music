import {mapState, mapMutations, mapActions} from 'vuex'

export default {
    computed: {
        ...mapState('api', ['play']),
        ...mapState('c_playlist', ['cycle']),
        ...mapState('lyrics', ['show']),
        volume: {
            get() {
                return this.play.volume
            },
            set(val) {
                this.$store.commit('api/updatePlay', {
                    volume: val
                })
                localStorage.volume = val
            }
        }
    },
    methods: {
        ...mapMutations('c_playlist', ['cycleChange']),
        ...mapActions('c_playlist', ['last', 'next']),
        pauseChange() {
            if (this.play.url) {
                this.$store.commit('api/pauseChange')
            }
        }
    },
    created() {
        this.$ipc.on('tray-control-last', this.last)
        this.$ipc.on('tray-control-next', () => {
            console.log('next')
            this.next()
        })
        this.$ipc.on('tray-control-pause', this.pauseChange)
    }
}
