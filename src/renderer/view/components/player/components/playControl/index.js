import {mapState, mapMutations, mapActions} from 'vuex'

export default {
    computed: {
        ...mapState('play', ['volume', 'url', 'pause']),
        ...mapState('c_playlist', ['cycle']),
        ...mapState('lyrics', ['show']),
        _volume: {
            get() {
                return this.volume
            },
            set(val) {
                this.$store.commit('play/update', {
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
            if (this.url) {
                this.$store.commit('play/pauseChange')
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
