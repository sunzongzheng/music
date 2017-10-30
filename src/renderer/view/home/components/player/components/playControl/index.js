import { mapState, mapMutations } from 'vuex'

export default {
  data () {
    return {
      volume: 100
    }
  },
  computed: {
    ...mapState('api', ['play']),
    ...mapState('c_playlist', ['cycle'])
  },
  watch: {
    volume (val) {
      this.$store.commit('api/updatePlay', {
        volume: val
      })
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