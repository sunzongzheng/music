import { mapState, mapActions } from 'vuex'

export default {
    name: 'playlist',
    data() {
        return {
            list: [],
            loading: false,
        }
    },
    computed: {
        ...mapState('playlist', ['playlist']),
        ...mapState('offline-playlist', ['offline_playlist']),
        id() {
            const id = this.$route.params.id
            return isNaN(Number(id)) ? id : Number(id)
        },
        info() {
            return (this.offline ? this.offline_playlist : this.playlist).filter(item => item.id === this.id)[0] || {}
        },
        offline() {
            return this.$route.query.offline
        }
    },
    methods: {
        ...mapActions('play', ['play', 'playAll']),
        getOfflineStoreName(id = this.id) {
            return `offline_playlist_${id}_song`
        },
        async getSong(id = this.id) {
            if (this.offline) {
                this.list = (JSON.parse(localStorage.getItem(this.getOfflineStoreName(id))) || [])
                this.updateSongsInfo()
                return
            }
            this.loading = true
            try {
                this.list = await this.$http.get(`playlist/${id}`)
                this.updateSongsInfo()
            } catch (e) {
                console.warn(e)
                this.$router.push('/')
            }
            this.loading = false
        },
        async removeFromPlaylist(item) {
            if (this.offline) {
                const list = JSON.parse(localStorage.getItem(this.getOfflineStoreName())) || []
                for (let i in list) {
                    if (list[i].songId === item.songId && list[i].vendor === item.vendor) {
                        list.splice(i, 1)
                        break
                    }
                }
                localStorage.setItem(this.getOfflineStoreName(), JSON.stringify(list))
                this.getSong()
                return
            }
            await this.$http.delete(`playlist/${this.id}`, {
                params: {
                    id: item.id,
                },
            })
            this.getSong()
        },
        doPlay(item) {
            let list = []
            this.list.forEach(item => {
                list.push(item)
            })
            this.play({
                info: item,
                playlist: list,
            })
        },
        rowClassName({ row, rowIndex }) {
            const rs = [
                this.s.row,
            ]
            if (row.cp) {
                rs.push(this.s.disabled)
            }
            return rs.join(' ')
        },
        // 更新歌曲信息
        async updateSongsInfo() {
            const data = await this.$musicApi.getAnyVendorSongDetail(this.list.map(item => {
                return {
                    id: item.songId,
                    vendor: item.vendor,
                }
            }))
            this.list = data.map((item, index) => {
                if (!item) {
                    return this.list[index]
                } else {
                    item.songId = this.list[index].songId
                    item.id = this.list[index].id
                    item.vendor = this.list[index].vendor
                    return item
                }
            })
        },
    },
    created() {
        this.getSong()
    },
    beforeRouteUpdate(to, from, next) {
        next()
        this.getSong(to.params.id)
    },
}