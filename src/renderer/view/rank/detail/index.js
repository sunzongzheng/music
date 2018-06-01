import {mapActions} from 'vuex'
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
            console.log(item)
            this.$store.commit('c_playlist/update', this.info.list)
            this.play(item)
        },
        rowClassName({row, rowIndex}) {
            const rs = [
                this.s.row
            ]
            if (row.cp) {
                rs.push(this.s.disabled)
            }
            return rs.join(' ')
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