import { mapActions } from 'vuex'

export default {
    props: {
        data: {
            type: Array,
            required: true,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        showVendor: {
            type: Boolean,
            default: true,
        },
        showOperate: {
            type: Boolean,
            default: true,
        },
        spanWidth: Array,
        slotAppendTitle: String,
        pagination: {
            type: Boolean,
            default: true,
        },
        canSearch: {
            type: Boolean,
            default: false,
        },
        contextMenu: {
            type: Boolean,
            default: true,
        },
        canDownload: {
            type: Boolean,
            default: true,
        },
        showLike: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            page: 1,
            limit: 20,
            keyword: '',
        }
    },
    computed: {
        spanList() {
            return this.spanWidth ? this.spanWidth : (this.showVendor ? [9, 7, 5, 3] : [10, 8, 6])
        },
        list() {
            if (!this.pagination) return this.data
            const start = (this.page - 1) * this.limit

            return this.data.slice(start, start + this.limit)
        },
        filterList() {
            return this.list.filter(song => {
                return song.name.includes(this.keyword) ||
                    song.artists.reduce((a, b) => a + b.name, '').includes(this.keyword) ||
                    song.album.name.includes(this.keyword)
            })
        },
    },
    methods: {
        ...mapActions('play', ['play']),
        ...mapActions('download', ['download']),
        doPlay(item) {
            this.play({
                info: item,
                playlist: this.data,
            })
        },
        // 显示右键菜单
        showContextMenu(item) {
            if (!this.contextMenu) return
            this.$contextMenu.song({
                ...item,
                id: item.songId,
            }, this.data)
        },
    },
}