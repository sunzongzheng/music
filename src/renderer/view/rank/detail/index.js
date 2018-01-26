import { mapActions } from 'vuex'
import eventBus from '../eventBus'

export default {
  name: 'rankDetail',
  computed: {
    info() {
      return eventBus.rankInfo
    }
  },
  methods: {
    ...mapActions('api', ['play']),
    doPlay(item) {
      this.$store.commit('c_playlist/update', this.info.list)
      this.play(item)
    }
  },
  beforeRouteEnter(to, from, next) {
    if (eventBus.rankInfo) {
      next()
    } else {
      Vue.router.push({name: 'rank.main'})
    }
  }
}