<template>
    <div :class="s.app" v-loading="loading">
        <detail-header :title="info.name"
                       :cover="info.cover | image('netease', 160)"
                       play-text="立即播放"
                       @play="doPlay(info.list[0])"
        >
            <p style="font-size: 12px;max-height: 70px;overflow: hidden;" v-html="info.description"></p>
            <span :class="s.total">累计播放：{{info.playCount}}</span>
            <template slot="btns" v-if="userInfo">
                <el-button @click="addToPlaylist" icon="el-icon-plus">
                    添加到歌单
                </el-button>
            </template>
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