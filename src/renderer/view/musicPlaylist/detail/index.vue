<template>
    <div :class="s.musicPlaylist" v-loading="loading">
        <div v-if="loading" style="height: 100%;"></div>
        <template v-else>
            <detail-header :title="detail.name"
                           :cover="detail.cover | image(vendor)"
                           play-text="播放全部"
                           @play="playAll(songs)"
            >
                <p :class="s.desc">{{detail.desc}}</p>
            </detail-header>
            <DataTable :data="songs"
                       :class="s.table"
            ></DataTable>
        </template>
    </div>
</template>
<script>
    import {mapActions} from 'vuex'
    export default {
        data() {
            return {
                detail: {
                    cover: '',
                    desc: '',
                    id: '',
                    name: ''
                },
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
            ...mapActions('play', ['play', 'playAll']),
            async getDetail() {
                this.loading = true
                const data = await this.$musicApi.getPlaylistDetail(this.vendor, this.id)
                if (data.status) {
                    this.detail = data.data.detail
                    this.songs = data.data.songs.map(item => {
                        item.vendor = this.vendor
                        item.songId = item.id
                        return item
                    })
                } else {
                    this.$message.warning(data.msg)
                }
                this.loading = false
            },
            doPlay() {
                this.play({
                    info: this.songs[0],
                    playlist: this.songs
                })
            }
        },
        created() {
            this.getDetail()
        }
    }
</script>
<style lang="scss" module="s">
    .musicPlaylist {
        height: 100%;
        .desc {
            font-size: 12px;
            height: 56px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 5;
            -webkit-box-orient: vertical;
            margin: 12px 0 0;
        }
    }
</style>