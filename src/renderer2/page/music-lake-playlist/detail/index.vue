<template>
    <detail-page
            :class="s.playlistDetail"
            :name="info.name"
            :cover="info.cover"
            :songsLoading="loading.getPlaylistSong"
            :songs="list"
    >
        <template slot="description">
            <p :class="s.createdBy">
                <icon type="user" :class="s.icon"></icon>
                <span>{{ nickname }}</span>
            </p>
            <table :class="s.createdAt">
                <tbody>
                <tr>
                    <td>创建时间：</td>
                    <td>{{ info.createdAt | date }}</td>
                </tr>
                </tbody>
            </table>
        </template>
        <template slot="btns">
            <m-button>
                <Icon type="import"></Icon>
                导入歌曲
            </m-button>
        </template>
    </detail-page>
</template>
<script>
    import { mapActions, mapGetters, mapState } from 'vuex'

    export default {
        data() {
            return {
                list: [],
                loading: {
                    getPlaylistSong: false,
                },
            }
        },
        computed: {
            ...mapGetters('user/playlist', ['playlistObject']),
            ...mapState('user/profile', ['nickname']),
            type() {
                return this.$route.params.type
            },
            id() {
                return this.$route.params.id
            },
            info() {
                return this.playlistObject[this.type][this.id] || {}
            },
        },
        watch: {
            $route: 'init',
        },
        methods: {
            ...mapActions('user/playlist', ['getPlaylistSong']),
            async init() {
                this.loading.getPlaylistSong = true
                try {
                    // 此处防止Vue添加观察者和依赖收集
                    this.list = Object.freeze(await this.getPlaylistSong({
                        id: this.id,
                        type: this.type,
                    }))
                } catch (e) {
                    this.$router.push('/')
                }
                this.loading.getPlaylistSong = false
                return
                // 异步更新歌曲信息
                const data = await this.$musicApi.getAnyVendorSongDetail(this.list.map(item => {
                    return {
                        id: item.songId,
                        vendor: item.vendor,
                    }
                }))
                this.list = Object.freeze(data.map((item,index) => {
                    if(!item) {
                        item = this.list[index]
                    }
                    return item
                }))
            },
        },
        created() {
            this.init()
        },
    }
</script>
<style lang="scss" module="s">
    .playlistDetail {
        .createdBy {
            display: flex;
            align-items: center;
            .icon {
                font-size: 18px;
            }
            span {
                color: $color-content;
                line-height: 1;
            }
        }

        .createdAt {
            color: $color-sub;
            margin-top: 4px;
        }
    }
</style>
