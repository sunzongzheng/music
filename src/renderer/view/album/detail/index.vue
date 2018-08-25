<template>
    <div :class="s.albumDetail"
         v-loading="loading"
    >
        <div :class="s.top">
            <img :src="detail.cover | image(vendor)"/>
            <div :class="s.right">
                <span :class="s.name">{{detail.name}}</span>
                <p :class="s.artist">歌手：<span>{{detail.artist.name}}</span></p>
                <p :class="s.date">发行时间：<span>{{detail.publishTime | date}}</span></p>
                <a :class="s.play" @click="play({ info: detail.songs[0], playlist: detail.songs })">播放全部</a>
            </div>
        </div>
        <DataTable :data="detail.songs"
                   :class="s.table"
                   :showVendor="false"
        ></DataTable>
    </div>
</template>
<script src="./index.js"></script>
<style lang="scss" module="s">
    .albumDetail {
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
                .artist,
                .date {
                    font-size: 14px;
                    color: $color-sub;
                    margin-top: 4px;
                    span {
                        color: $color-content;
                    }
                }
                .play {
                    position: absolute;
                    bottom: 2px;
                    left: 24px;
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
        }
    }
</style>