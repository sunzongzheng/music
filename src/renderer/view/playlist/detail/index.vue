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
<script src="./index.js"></script>
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