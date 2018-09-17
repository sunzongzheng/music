import {mapActions} from 'vuex'

export default {
    data() {
        return {
            detail: {},
            songs: [],
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
        ...mapActions('play', ['play']),
        async getSongs() {
            this.loading = true
            try {
                let data = await Vue.$musicApi.getArtistSongs(this.vendor, this.id)
                if (data.status) {
                    this.detail = data.data.detail
                    this.songs = data.data.songs.map(item => {
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
        this.getSongs()
    },
    beforeRouteUpdate(to, form, next) {
        next()
        this.getSongs()
    },
    beforeRouteEnter(to, from, next) {
        if (!to.query.vendor) {
            return Vue.$router.push('/')
        }
        next()
    }
}