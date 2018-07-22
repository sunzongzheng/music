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
        ...mapActions('play', ['play']),
        doPlay(item) {
            this.play({
                info: item,
                playlist: this.info.list
            })
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
            Vue.$router.push({name: 'rank.list'})
        }
    }
}