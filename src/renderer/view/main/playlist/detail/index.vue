<template>
    <div :class="s.app">
        <div :class="s.top">
            <p :class="s.title">{{name}}</p>
            <router-link :to="{ name: 'playlist.import', query: { offline: offline } }"
                         v-if="!offline"
            >导入歌单歌曲
            </router-link>
        </div>
        <el-table :data="list" :class="s.table" v-loading="loading" :row-class-name="rowClassName">
            <el-table-column label="歌曲" :width="220">
                <template slot-scope="scope">
                    <div :class="s.nameItem">
                        <div :class="s.songName" :title="scope.row.name">
                            {{scope.row.name}}
                        </div>
                        <div :class="s.songControl">
                            <Icon type="item-play" @click.native="doPlay(scope.row)" v-if="!scope.row.cp"></Icon>
                            <add-to-playlist :info="scope.row"></add-to-playlist>
                            <Icon type="huishouzhan" @click.native="removeFromPlaylist(scope.row)"></Icon>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="歌手">
                <template slot-scope="scope">
                    <template v-for="item in scope.row.artists">
                        <router-link v-if="item.id"
                                     :class="s.link"
                                     :to="{ name: 'artist', params: { id: item.id }, query: { vendor:  scope.row.vendor } }">
                            {{item.name}}
                        </router-link>
                        <template v-else>
                            {{item.name}}
                        </template>
                    </template>
                </template>
            </el-table-column>
            <el-table-column prop="album.name" label="专辑"></el-table-column>
            <el-table-column label="来源">
                <template slot-scope="scope">
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
                const id = this.$route.params.id
                return isNaN(Number(id)) ? id : Number(id)
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
                    this.list = (JSON.parse(localStorage.getItem(this.getOfflineStoreName(id))) || []).map(item => {
                        return {
                            ...item,
                            songId: item.commentId || item.songId
                        }
                    })
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
            },
            // 更新歌曲信息
            async updateSongsInfo() {
                const list = {
                    netease: [],
                    qq: [],
                    xiami: []
                }
                const detail = {
                    netease: {},
                    qq: {},
                    xiami: {}
                }
                this.list.forEach(item => {
                    list[item.vendor].push(item)
                })
                const vendors = ['netease', 'qq', 'xiami']
                for (let vendor of vendors) {
                    const ids = list[vendor].map(item => item.commentId)
                    if (ids.length) {
                        const data = await this.$api.getBatchSongDetail(vendor, ids)
                        if (data.status) {
                            data.data.forEach(item => {
                                detail[vendor][item.id] = item
                            })
                        }
                    }
                }
                for (let item of this.list) {
                    const info = detail[item.vendor][item.commentId]
                    if (info) {
                        item.cp = info.cp
                        item.name = info.name
                        item.commentId = info.id
                        item.album = info.album
                        item.artists = info.artists
                    } else {
                        // 音乐平台删歌以后这首歌就不能听了
                        // 如果是QQ音乐 有可能改了ID 调用单个获取信息接口验证
                        if (item.vendor === 'qq') {
                            const singleInfo = await this.$api.getSongDetail(item.vendor, item.songId)
                            if (singleInfo.status) {
                                console.log('歌曲ID变了：', item)
                                item.cp = singleInfo.data.cp
                                item.name = singleInfo.data.name
                                item.commentId = singleInfo.data.id
                                item.album = singleInfo.data.album
                                item.artists = singleInfo.data.artists
                            } else {
                                console.log('歌曲被删：', item)
                                item.cp = true
                            }
                        } else {
                            console.log('歌曲被删：', item)
                            item.cp = true
                        }
                    }
                    return item
                }
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
        .top {
            display: flex;
            width: 100%;
            height: 30px;
            align-items: flex-end;
            .title {
                font-size: 20px;
                color: #191919;
                margin: 0;
                line-height: 1;
            }
            a {
                color: $color-sub;
                font-size: 12px;
                line-height: 1;
                margin-left: 8px;
                text-decoration: none;
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
            .link {
                color: $color-table-text;
                transition: color .2s;
                text-decoration: none;
                &:hover {
                    transition: color .2s;
                    color: $color-primary;
                }
            }
        }
    }
</style>