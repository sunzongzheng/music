<template>
    <div :class="s.dataTable" v-loading="loading">
        <template v-if="!loading && data.length">
            <el-row :class="[s.row, s.thead]">
                <el-col :span="spanList[0]">歌曲</el-col>
                <el-col :span="spanList[1]">歌手</el-col>
                <el-col :span="spanList[2]">专辑</el-col>
                <el-col :span="spanList[3]" v-if="showVendor">来源</el-col>
                <el-col :span="spanList[4]" v-if="spanList[4]">{{slotAppendTitle}}</el-col>
            </el-row>
            <el-row v-for="(item,index) in list"
                    :class="{ [s.row] : true, [s.disabled] : item.cp }"
                    :key="item.songId"
                    @click.native="$emit('rowClick', item)"
                    @contextmenu.native="showContextMenu(item)"
            >
                <el-col :span="spanList[0]">
                    <div :class="s.nameItem">
                        <div :class="s.songName" :title="item.name">{{item.name}}</div>
                        <div :class="s.songControl" v-if="showOperate">
                            <slot name="songControlPrepend" :row="item" :$index="index"></slot>
                            <Icon type="item-play" @click="doPlay(item)" v-if="!item.cp" clickable></Icon>
                            <Icon type="like" disabled></Icon>
                            <Icon type="download" disabled></Icon>
                            <slot name="songControlAppend" :row="item" :$index="index"></slot>
                            <Icon type="more" clickable @click="showContextMenu(item)"></Icon>
                        </div>
                    </div>
                </el-col>
                <el-col :span="spanList[1]">
                    <template v-for="artist in item.artists">
                        <router-link v-if="artist.id"
                                     :class="s.link"
                                     :to="{ name: 'artist.detail', params: { id: artist.id }, query: { vendor: item.vendor } }">
                            {{artist.name}}
                        </router-link>
                        <template v-else>
                            {{artist.name}}
                        </template>
                    </template>
                </el-col>
                <el-col :span="spanList[2]">
                    <router-link :class="s.link"
                                 :to="{ name: 'album.detail', params: { id: item.album.id }, query: { vendor: item.vendor } }"
                    >
                        {{item.album.name}}
                    </router-link>
                </el-col>
                <el-col :span="spanList[3]" v-if="showVendor">
                    {{item.vendor | source}}
                </el-col>
                <el-col :span="spanList[4]" v-if="spanList[4]">
                    <slot name="append" :row="item"></slot>
                </el-col>
            </el-row>
            <el-pagination v-if="!loading && data.length > limit"
                           layout="prev, pager, next"
                           :total="data.length"
                           style="text-align: center; margin-top: 8px;"
                           :current-page.sync="page"
                           :page-size="limit"
            ></el-pagination>
        </template>
        <div :class="s.nodata" v-else>
            <Icon type="wushuju" :class="s.icon"></Icon>
            <p>暂无数据~</p>
        </div>
    </div>
</template>
<script>
    import {mapState, mapActions, mapMutations} from 'vuex'
    import {remote} from 'electron'

    export default {
        props: {
            data: {
                type: Array,
                required: true
            },
            loading: {
                type: Boolean,
                default: false
            },
            showVendor: {
                type: Boolean,
                default: true
            },
            showOperate: {
                type: Boolean,
                default: true
            },
            spanWidth: Array,
            slotAppendTitle: String
        },
        data() {
            return {
                page: 1,
                limit: 20,
                contextItem: null
            }
        },
        computed: {
            ...mapState('user', ['info']),
            ...mapState('play', {
                playInfo: 'info'
            }),
            ...mapState('playlist', ['playlist']),
            ...mapState('offline-playlist', ['offline_playlist']),
            spanList() {
                return this.spanWidth ? this.spanWidth : (this.showVendor ? [9, 7, 5, 3] : [10, 8, 6])
            },
            list() {
                const start = (this.page - 1) * this.limit

                return this.data.slice(start, start + this.limit)
            },
            // 右键菜单
            menu() {
                const menus = [
                    {
                        label: '播放',
                        click: () => {
                            console.log(this.contextItem)
                            this.doPlay(this.contextItem)
                        }
                    },
                    {
                        label: '下一首播放',
                        enabled: Boolean(this.playInfo),
                        click: () => {
                            this.updateNextPlay(this.contextItem)
                        }
                    },
                    {
                        type: 'separator'
                    },
                ]
                const playlist = {
                    label: '添加到',
                    submenu: []
                }
                if ((this.info && this.playlist.length) || this.offline_playlist.length) {
                    if (this.info && this.playlist.length) {
                        playlist.submenu.push({
                            label: '云歌单',
                            enabled: false,
                        })
                        this.playlist.forEach(item => {
                            playlist.submenu.push({
                                label: item.name,
                                click: () => {
                                    this.collect({
                                        id: item.id,
                                        info: this.contextItem
                                    })
                                }
                            })
                        })
                        playlist.submenu.push({
                            type: 'separator'
                        })
                    }
                    if (this.offline_playlist.length) {
                        playlist.submenu.push({
                            label: '离线歌单',
                            enabled: false
                        })
                        this.offline_playlist.forEach(item => {
                            playlist.submenu.push({
                                label: item.name,
                                click: () => {
                                    this.collectOffline({
                                        id: item.id,
                                        info: this.contextItem
                                    })
                                }
                            })
                        })
                    }
                } else {
                    playlist.submenu.push({
                        label: '暂无歌单',
                        enabled: false
                    })
                }
                menus.push(playlist)
                menus.push({
                    label: '查看评论',
                    click: () => {
                        this.$router.push({
                            name: 'song.comments',
                            params: {
                                id: this.contextItem.songId,
                            },
                            query: {
                                vendor: this.contextItem.vendor
                            }
                        })
                    }
                })
                menus.push({
                    label: '下载',
                    enabled: false
                })
                menus.push({
                    label: '分享',
                    click: () => {
                        this.$ipc.send('share', this.contextItem)
                    }
                })
                return remote.Menu.buildFromTemplate(menus)
            }
        },
        methods: {
            ...mapActions('play', ['play']),
            ...mapActions('playlist', ['collect']),
            ...mapActions('offline-playlist', {
                collectOffline: 'collect'
            }),
            ...mapMutations('c_playlist', ['updateNextPlay']),
            doPlay(item) {
                this.play({
                    info: item,
                    playlist: this.data
                })
            },
            // 显示右键菜单
            showContextMenu(item) {
                this.contextItem = {
                    ...item,
                    id: item.songId
                }
                this.menu.popup(remote.getCurrentWindow())
            }
        }
    }
</script>
<style lang="scss" module="s">
    .dataTable {
        color: $color-content;
        font-size: 13px;
        margin-bottom: 16px;
        .row {
            transition: all .2s;
            :global {
                .el-col {
                    display: block;
                    height: 48px;;
                    line-height: 48px;
                    padding: 0 10px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
            &:not(.thead):hover {
                transition: all .2s;
                background: #f5f7fa;
            }
            &.thead {
                font-weight: bold;
            }
            .nameItem {
                display: flex;
                justify-content: space-between;
                width: 100%;
                .songName {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .songControl {
                    display: none;
                    align-items: center;
                    color: $color-content;
                    svg {
                        margin-left: 9px;
                        font-size: 14px;
                    }
                }
            }
            &:hover {
                .songControl {
                    display: flex;
                }
            }
            .link {
                color: $color-content;
                text-decoration: none;
                &:hover {
                    color: $color-primary;
                }
            }
            &.disabled {
                color: rgba(68, 68, 68, .6);
                .link {
                    color: rgba(68, 68, 68, .6);
                }
            }
        }
        .nodata {
            display: flex;
            width: 100%;
            min-height: 200px;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .icon {
                font-size: 100px;
            }
            p {
                margin: 0;
            }
        }
    }
</style>