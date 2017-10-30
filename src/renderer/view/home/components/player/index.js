import { mapState } from 'vuex'
import playList from './components/current_playlist/index.vue'
import Clickoutside from 'element-ui/src/utils/clickoutside'
import Popover from 'element-ui/packages/popover'
import playControl from './components/playControl/index.vue'
import playInfo from './components/playInfo/index.vue'

export default {
  components: {playList, playControl, playInfo},
  directives: {Clickoutside, Popover},
  data () {
    return {
      modal: false,
      lyrics_visible: false
    }
  },
  computed: {
    ...mapState('api', ['play']),
    ...mapState('playlist', ['playlist'])
  },
  methods: {
    closeModal () {
      if (this.modal) {
        this.modal = false
      }
    }
  }
}
