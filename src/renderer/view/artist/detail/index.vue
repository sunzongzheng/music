<template>
    <div :class="s.artist"
         v-loading="loading"
    >
        <div :class="s.top">
            <img :src="detail.avatar | image(vendor)"/>
            <div :class="s.right">
                <span :class="s.name">{{detail.name}}</span>
                <p v-html="detail.desc"
                   :class="s.detail"
                ></p>
            </div>
        </div>
        <el-table :data="songs"
                  :class="s.table"
                  :row-class-name="rowClassName"
        >
            <el-table-column label="歌曲" :width="220">
                <template slot-scope="scope">
                    <div :class="s.nameItem">
                        <div :class="s.songName" :title="scope.row.name">{{scope.row.name}}</div>
                        <div :class="s.songControl">
                            <Icon type="item-play" @click.native="doPlay(scope.row)" v-if="!scope.row.cp"></Icon>
                            <add-to-playlist :info="scope.row"></add-to-playlist>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="歌手" :class-name="s.singer">
                <template slot-scope="scope">
                    <template v-for="item in scope.row.artists">
                        <router-link v-if="item.id && item.id.toString() !== id.toString()"
                                     :class="s.link"
                                     :to="{ name: 'artist.detail', params: { id: item.id }, query: { vendor } }">
                            {{item.name}}
                        </router-link>
                        <template v-else>
                            {{item.name}}
                        </template>
                    </template>
                </template>
            </el-table-column>
            <el-table-column prop="album.name" label="专辑">
                <template slot-scope="scope">
                    <span :class="s.album">{{scope.row.album.name}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script src="./index.js"></script>
<style lang="scss" module="s">
    .artist {
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
                padding-left: 24px;
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
                .detail {
                    font-size: 12px;
                    height: 88px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 5;
                    -webkit-box-orient: vertical;
                    margin: 12px 0 0;
                    p {
                        font-size: 12px;
                        color: #222;
                        margin: 0;
                    }
                    strong {
                        display: none;
                    }
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
                &.disabled {
                    opacity: .6;
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