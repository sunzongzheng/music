<template>
    <div :class="s.app">
        <div :class="s.top">
            <img :src="info.cover"/>
            <div :class="s.right">
                <span :class="s.name">{{info.name}}</span>
                <p style="font-size: 12px">{{info.description}}</p>
                <a :class="s.play" @click="doPlay(info.list[0])">立即播放</a>
                <span :class="s.total">累计播放：{{info.playCount}}</span>
            </div>
        </div>
        <el-table :data="info.list"
                  :class="s.table"
                  :row-class-name="s.row"
        >
            <el-table-column label="歌曲" :width="220">
                <template scope="scope">
                    <div :class="s.nameItem">
                        <div :class="s.songName" :title="scope.row.name">{{scope.row.name}}</div>
                        <div :class="s.songControl">
                            <Icon type="item-play" @click.native="doPlay(scope.row)"></Icon>
                            <add-to-playlist :info="scope.row"></add-to-playlist>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="歌手" :class-name="s.singer">
                <template scope="scope">
                    <template v-for="singer in scope.row.artists">
                        {{singer.name}}
                    </template>
                </template>
            </el-table-column>
            <el-table-column prop="album.name" label="专辑">
                <template scope="scope">
                    <span :class="s.album">{{scope.row.album.name}}</span>
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
            background-color: #FAFAFA;
            padding: 26px;
            $imgWidth: 135px;
            & > img {
                width: $imgWidth;
                height: $imgWidth;
            }
            .right {
                display: flex;
                flex-direction: column;
                padding-left: 16px;
                width: calc(100% - #{$imgWidth});
                position: relative;
                .name {
                    font-size: 22px;
                    font-weight: bold;
                }
                .play {
                    position: absolute;
                    bottom: 2px;
                    left: 16px;
                    cursor: pointer;
                    display: flex;
                    width: 100px;
                    height: 22px;
                    justify-content: center;
                    align-items: center;
                    border-radius: 4px;
                    font-size: 14px;
                    background-color: #67C23A;
                    color: white;
                    transition: all .2s;
                    &:hover {
                        transition: all .2s;
                        opacity: .8;
                    }
                }
                .total {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    font-size: 12px;
                    color: gray;
                }
            }
        }
        .table {
            width: 100%;
            padding: 0 24px;
            overflow-x: hidden;
            .row {
                &:hover {
                    .songControl {
                        display: inline-flex;
                        align-items: center;
                    }
                }
            }
            .nameItem {
                display: flex;
                .songName {
                    width: 160px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    padding-left: 4px;
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
            .singer {
                :global {
                    .cell {
                        @include text-ellipsis;
                    }
                }
            }
            .album {
                display: block;
                width: 200px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            :global {
                .el-table__body-wrapper {
                    overflow-x: hidden;
                }
            }
        }
    }
</style>