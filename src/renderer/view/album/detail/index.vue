<template>
    <div :class="s.albumDetail"
         v-loading="loading"
    >
        <div v-if="loading" style="height: 100%;"></div>
        <template v-else>
            <detail-header :title="detail.name"
                           :cover="detail.cover | image(vendor)"
                           play-text="播放全部"
                           @play="playAll(detail.songs)"
            >
                <p :class="s.artist">歌手：<span>{{detail.artist.name}}</span></p>
                <p :class="s.date">发行时间：<span>{{detail.publishTime | date}}</span></p>
            </detail-header>
            <DataTable :data="detail.songs"
                       :class="s.table"
                       :showVendor="false"
            ></DataTable>
        </template>
    </div>
</template>
<script src="./index.js"></script>
<style lang="scss" module="s">
    .albumDetail {
        height: 100%;
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
        .table {
            width: 100%;
            padding: 0 20px;
        }
    }
</style>