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
                    @dblclick.native="doPlay(item)"
            >
                <el-col :span="spanList[0]">
                    <div :class="s.nameItem">
                        <div :class="s.songName" :title="item.name">{{item.name}}</div>
                        <div :class="s.songControl" v-if="showOperate">
                            <slot name="songControlPrepend" :row="item" :$index="index"></slot>
                            <Icon type="item-play" @click="doPlay(item)" v-if="!item.cp" clickable></Icon>
                            <Icon type="like" disabled></Icon>
                            <Icon type="download" clickable :disabled="item.cp || !item.dl" @click="download(item)"></Icon>
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
            <el-pagination v-if="pagination && !loading && data.length > limit"
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
    import {mapActions} from 'vuex'

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
            slotAppendTitle: String,
            pagination: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                page: 1,
                limit: 20,
            }
        },
        computed: {
            spanList() {
                return this.spanWidth ? this.spanWidth : (this.showVendor ? [9, 7, 5, 3] : [10, 8, 6])
            },
            list() {
                if(!this.pagination) return this.data
                const start = (this.page - 1) * this.limit

                return this.data.slice(start, start + this.limit)
            }
        },
        methods: {
            ...mapActions('play', ['play']),
            ...mapActions('download', ['download']),
            doPlay(item) {
                this.play({
                    info: item,
                    playlist: this.data
                })
            },
            // 显示右键菜单
            showContextMenu(item) {
                this.$contextMenu.song({
                    ...item,
                    id: item.songId
                }, this.data)
            }
        }
    }
</script>
<style lang="scss" module="s">
    .dataTable {
        color: $color-content;
        font-size: 13px;
        padding: 0 20px;
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
                    cursor: pointer;
                    user-select: none;
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