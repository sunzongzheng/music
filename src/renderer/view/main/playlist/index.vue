<template>
    <div :class="s.app">
        <a :class="s.title">{{name}}</a>
        <el-table :data="list" :class="s.table" v-loading="loading" :row-class-name="rowClassName">
            <el-table-column label="歌曲" :width="220">
                <template scope="scope">
                    <div :class="s.nameItem">
                        <div :class="s.songName" :title="scope.row.name">{{scope.row.name}}</div>
                        <div :class="s.songControl">
                            <Icon type="item-play" @click.native="doPlay(scope.row)" v-if="!scope.row.cp"></Icon>
                            <add-to-playlist :info="scope.row"></add-to-playlist>
                            <Icon type="huishouzhan" @click.native="removeFromPlaylist(scope.row)"></Icon>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="歌手">
                <template scope="scope">
                    {{scope.row.artists[0].name}}
                </template>
            </el-table-column>
            <el-table-column prop="album.name" label="专辑"></el-table-column>
            <el-table-column label="来源">
                <template scope="scope">
                    {{scope.row.vendor | source}}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import {mapState, mapActions} from 'vuex'

    export default {
        name: 'playlist',
        data() {
            return {
                list: [],
                loading: false
            }
        },
        computed: {
            ...mapState('playlist', ['playlist']),
            ...mapState('offline-playlist', ['offline_playlist']),
            id() {
                return this.$route.params.id
            },
            name() {
                const arr = (this.offline ? this.offline_playlist : this.playlist).filter(item => item.id === this.id)
                return arr.length ? arr[0].name : ''
            },
            offline() {
                return this.$route.query.offline
            },
        },
        methods: {
            ...mapActions('api', ['play']),
            getOfflineStoreName(id = this.id) {
                return `offline_playlist_${id}_song`
            },
            async getSong(id = this.id) {
                if (this.offline) {
                    this.list = JSON.parse(localStorage.getItem(this.getOfflineStoreName(id))) || []
                    return
                }
                this.loading = true
                try {
                    this.list = await this.$http.get(`playlist/${id}`)
                    // 拿到详情后更新网易云歌曲信息
                    const data = await this.$api.getBatchSongDetail('netease', this.list.filter(item => item.vendor === 'netease').map(item => item.songId))
                    const infoObject = {}
                    if (data.status) {
                        data.data.forEach(item=>{
                            infoObject[item.id] = item
                        })
                        this.list = this.list.map(item => {
                            if(item.vendor === 'netease') {
                                const info = infoObject[item.songId]
                                item.cp = info.cp
                                item.name = info.name
                                item.commentId = info.commentId
                                item.album = info.album
                                item.artists = info.artists
                            }
                            return item
                        })
                    }
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
                        id: item.id
                    }
                })
                this.getSong()
            },
            doPlay(item) {
                let list = []
                this.list.forEach(item => {
                    list.push(item)
                })
                this.$store.commit('c_playlist/update', list)
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
        created() {
            this.getSong()
        },
        beforeRouteUpdate(to, from, next) {
            next()
            this.getSong(to.params.id)
        }
    }
</script>
<style lang="scss" module="s">
    .app {
        padding: 0 16px;
        .title {
            display: flex;
            width: 100%;
            font-size: 20px;
            color: #191919;
            height: 46px;
            padding-top: 16px;
            align-items: center;
            .edit {
                font-size: 16px;
                margin-left: 8px;
                color: #777;
            }
        }
        .table {
            width: 100%;
            height: calc(100% - 46px);
            margin-top: 20px;
            overflow: auto;
            .row.disabled {
                opacity: .6;
            }
            .nameItem {
                display: flex;
                &:hover {
                    .songControl {
                        display: inline-flex;
                        align-items: center;
                    }
                }
                .songName {
                    width: 160px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .songControl {
                    display: none;
                    width: 60px;
                    svg {
                        margin-left: 6px;
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>