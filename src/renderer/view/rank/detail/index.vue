<template>
    <div :class="s.app">
        <detail-header :title="info.name"
                       :cover="info.cover | image('netease', 160)"
                       play-text="立即播放"
                       @play="doPlay(info.list[0])"
        >
            <p style="font-size: 12px">{{info.description}}</p>
            <span :class="s.total">累计播放：{{info.playCount}}</span>
        </detail-header>
        <DataTable :data="info.list"
                   :class="s.table"
                   :showVendor="false"
        ></DataTable>
    </div>
</template>
<script src="./index.js"></script>
<style lang="scss" module="s">
    .app {
        .total {
            position: absolute;
            bottom: 0;
            right: 0;
            font-size: 12px;
            color: gray;
        }
        .table {
            width: 100%;
            padding: 0 20px;
        }
    }
</style>