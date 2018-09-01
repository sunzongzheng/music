import {mapActions} from 'vuex'
import eventBus from '../eventBus'

export default {
    name: 'rankDetail',
    data() {
        return {
            loading: false,
            info: eventBus.list[this.$route.params.id]
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
        },
        async getDetail() {
            this.loading = true
            try {
                const data = await this.$http.get('/music/netease/rank', {
                    params: {
                        ids: [this.info.id]
                    }
                })
                if (data[0]) {
                    this.info.list = data[0].list.map(item => {
                        item.vendor = 'netease'
                        item.songId = item.commentId = item.id
                        return item
                    })
                } else {
                    this.$message.warning('无法获取详情')
                }
            } catch (e) {
                console.warn(e)
            }
            this.loading = false
        }
    },
    created() {
        if (this.info.list.length <= 3) {
            this.getDetail()
        }
    },
    beforeRouteEnter(to, from, next) {
        const id = to.params.id
        if (eventBus.list[id]) {
            next()
        } else {
            Vue.$router.push({name: 'rank.list'})
        }
    }
}