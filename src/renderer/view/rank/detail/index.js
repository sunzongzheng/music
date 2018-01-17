import { mapActions } from 'vuex'
import eventBus from '../eventBus'

export default {
  computed: {
    info() {
      return eventBus.rankInfo
    }
  },
  methods: {
    ...mapActions('api', ['play']),
    doPlay(item) {
      this.$store.commit('c_playlist/update', this.info.list.map(item => {
        item.source = 'netease'
        return item
      }))
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