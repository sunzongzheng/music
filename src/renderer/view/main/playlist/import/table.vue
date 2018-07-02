<template>
    <div :class="s.album_table">
        <div :class="s.top">
            <p :class="s.title">{{album.detail.name}}</p>
        </div>
        <el-table :data="album.songs"
                  :class="s.table"
                  :row-class-name="rowClassName"
                  :max-height="48 * 8"
        >
            <el-table-column label="歌曲" :width="220">
                <template slot-scope="scope">
                    <div :class="s.nameItem">
                        <div :class="s.songName" :title="scope.row.name">
                            {{scope.row.name}}
                        </div>
                        <div :class="s.songControl">
                            <Icon type="item-play" @click.native="doPlay(scope.row)" v-if="!scope.row.cp"></Icon>
                            <add-to-playlist :info="scope.row"></add-to-playlist>
                            <Icon type="huishouzhan" @click.native="removeFromPlaylist(scope.$index)"></Icon>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="歌手">
                <template slot-scope="scope">
                    <template v-for="item in scope.row.artists">
                        {{item.name}}
                    </template>
                </template>
            </el-table-column>
            <el-table-column prop="album.name" label="专辑"></el-table-column>
            <el-table-column label="结果" :width="120">
                <template v-if="scope.row.status > -1"
                          slot-scope="scope"
                >
                    <p :class="{ [s.result] : true, [s.success]: scope.row.status }">
                        {{scope.row.status ? '成功' : `失败: ${scope.row.msg}`}}
                    </p>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import {mapState, mapActions} from 'vuex'

    export default {
        props: {
            album: Object
        },
        methods: {
            ...mapActions('api', ['play']),
            async removeFromPlaylist(index) {
                this.album.songs.splice(index, 1)
            },
            doPlay(item) {
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
        }
    }
</script>
<style lang="scss" module="s">
    .album_table {
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
            .result{
                color: #F56C6C;
                &.success{
                    color: $color-primary;
                }
            }
        }
    }
</style>