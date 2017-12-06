import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState('api', ['play']),
    ...mapState('c_playlist', ['cycle']),
    ...mapState('lyrics', ['show']),
    volume: {
      get () {
        return this.play.volume
      },
      set (val) {
        this.$store.commit('api/updatePlay', {
          volume: val
        })
        localStorage.volume = val
      }
    }
  },
  methods: {
    ...mapMutations('c_playlist', ['cycleChange']),
    pauseChange () {
      if (this.play.url) {
        this.$store.commit('api/pauseChange')
      }
    }
  }
}
