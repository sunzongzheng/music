<template>
    <div :class="s.localSongs">
        <div :class="s.top">
            <p :class="s.title">本地歌曲</p>
            <p :class="s.sub">当前设置的扫描路径：{{setting.localSongsFolders.join('、')}}</p>
        </div>
        <data-table :data="songs"
                    :show-vendor="false"
                    :contextMenu="false"
                    :canDownload="false"
                    :showLike="false"
        ></data-table>
        <!--<el-table :data="songs"-->
        <!--style="width: 100%; margin-top: 16px;"-->
        <!--v-loading="loading"-->
        <!--&gt;-->
        <!--<el-table-column prop="name"-->
        <!--label="文件名"-->
        <!--&gt;</el-table-column>-->
        <!--<el-table-column prop="folder"-->
        <!--label="文件夹"-->
        <!--&gt;</el-table-column>-->
        <!--<el-table-column prop="size"-->
        <!--label="文件大小"-->
        <!--width="80"-->
        <!--&gt;-->
        <!--<template slot-scope="scope">-->
        <!--<span>{{(scope.row.size / 1000 / 1000).toFixed(2)}}M</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--</el-table>-->
    </div>
</template>
<script>
    import { mapState, mapActions } from 'vuex'

    export default {
        data() {
            return {
                loading: false,
            }
        },
        computed: {
            ...mapState('user', ['setting']),
            ...mapState('local-songs', ['songs']),
        },
        methods: {
            ...mapActions('local-songs', ['refresh']),
        },
        created() {
            this.loading = true
            this.refresh()
            this.loading = false
        },
    }
</script>
<style lang="scss" module="s">
    .localSongs {
        .top {
            padding: 16px 24px;
            .title {
                font-size: 22px;
                color: $color-title;
            }
            .sub {
                color: $color-sub;
                font-size: 12px;
            }
        }
    }
</style>