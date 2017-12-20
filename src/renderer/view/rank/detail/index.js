import { mapState, mapActions } from 'vuex'
import Vue from 'vue'

export default {
  computed: {
    ...mapState('rank', ['info'])
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
    console.log(Vue.store.state.rank.info)
    if (Vue.store.state.rank.info) {
      next()
    } else {
      Vue.router.push({name: 'rank.main'})
    }
  }
}