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
        <DataTable :data="songs"
                   :class="s.table"
                   :showVendor="false"
        ></DataTable>
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
        }
    }
</style>