import {mapActions} from 'vuex'

export default {
    data() {
        return {
            detail: {
                name: '',
                cover: '',
                desc: '',
                songs: [],
                artist: {}
            },
            loading: false
        }
    },
    computed: {
        id() {
            return this.$route.params.id
        },
        vendor() {
            return this.$route.query.vendor
        }
    },
    methods: {
        ...mapActions('play', ['play', 'playAll']),
        async getDetail() {
            this.loading = true
            try {
                let data = await Vue.$musicApi.getAlbumDetail(this.vendor, this.id)
                if (data.status) {
                    this.detail = data.data
                    this.detail.songs = data.data.songs.map(item => {
                        return {
                            ...item,
                            songId: item.id,
                            vendor: this.vendor
                        }
                    })
                }
            } catch (e) {
                console.warn(e)
                e.msg && this.$message.warning(e.msg)
            }
            this.loading = false
        }
    },
    created() {
        this.getDetail()
    },
    beforeRouteUpdate(to, form, next) {
        next()
        this.getDetail()
    },
    beforeRouteEnter(to, from, next) {
        if (!to.query.vendor) {
            return Vue.$router.push('/')
        }
        next()
    }
}