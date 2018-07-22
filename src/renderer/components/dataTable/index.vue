<template>
    <div :class="s.dataTable" v-loading="loading">
        <template v-if="!loading && data.length">
            <el-row :class="[s.row, s.thead]">
                <el-col :span="spanList[0]">歌曲</el-col>
                <el-col :span="spanList[1]">歌手</el-col>
                <el-col :span="spanList[2]">专辑</el-col>
                <el-col :span="spanList[3]" v-if="showVendor">来源</el-col>
            </el-row>
            <el-row v-for="item in data"
                    :class="{ [s.row] : true, [s.disabled] : item.cp }"
                    :key="item.songId"
            >
                <el-col :span="spanList[0]">
                    <div :class="s.nameItem">
                        <div :class="s.songName" :title="item.name">{{item.name}}</div>
                        <div :class="s.songControl">
                            <Icon type="item-play" @click="doPlay(item)" v-if="!item.cp"></Icon>
                            <add-to-playlist :info="item"></add-to-playlist>
                            <slot name="songControlAppend" :row="item"></slot>
                        </div>
                    </div>
                </el-col>
                <el-col :span="spanList[1]">
                    <template v-for="artist in item.artists">
                        <router-link v-if="artist.id"
                                     :class="s.link"
                                     :to="{ name: 'artist', params: { id: artist.id }, query: { vendor: item.vendor } }">
                            {{artist.name}}
                        </router-link>
                        <template v-else>
                            {{artist.name}}
                        </template>
                    </template>
                </el-col>
                <el-col :span="spanList[2]">
                    {{item.album.name}}
                </el-col>
                <el-col :span="spanList[3]" v-if="showVendor">
                    {{item.vendor | source}}
                </el-col>
            </el-row>
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
            }
        },
        computed: {
            spanList() {
                return this.showVendor ? [8, 7, 5, 4] : [10, 8, 6]
            }
        },
        methods: {
            ...mapActions('play', ['play']),
            doPlay(item) {
                this.play({
                    info: item,
                    playlist: this.data
                })
            }
        }
    }
</script>
<style lang="scss" module="s">
    .dataTable {
        color: $color-table-text;
        font-size: 14px;
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
            &.disabled {
                opacity: .6;
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
                    svg {
                        margin-left: 6px;
                        cursor: pointer;
                    }
                }
            }
            &:hover {
                .songControl {
                    display: flex;
                }
            }
            .link {
                color: $color-table-text;
                text-decoration: none;
                &:hover {
                    color: $color-primary;
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