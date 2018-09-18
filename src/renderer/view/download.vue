<template>
    <div :class="s.download">
        <div :class="s.top">
            <span :class="s.title">下载歌曲</span>
            <span :class="s.openDownloadFolder" @click="openDownloadFolder">打开下载目录</span>
        </div>
        <el-tabs v-model="activeName">
            <el-tab-pane label="已下载" name="downloaded">
                <data-table :data="downloaded" style="padding: 0">
                    <!-- 删除 !-->
                    <Icon slot="songControlAppend"
                          slot-scope="scope"
                          type="huishouzhan"
                          clickable
                          @click="removeFromDownloaded(scope.$index)"
                    ></Icon>
                </data-table>
            </el-tab-pane>
            <el-tab-pane name="downloading">
                <span slot="label">
                    <el-badge :value="downloading.length" v-if="downloading.length">
                        下载中
                    </el-badge>
                    <template v-else>下载中</template>
                </span>
                <data-table :data="downloading"
                            style="padding: 0"
                            :showVendor="false"
                            slotAppendTitle="下载进度"
                            :spanWidth="[8, 7, 4, 0, 5]"
                >
                    <!-- 删除 !-->
                    <Icon slot="songControlAppend"
                          slot-scope="scope"
                          type="huishouzhan"
                          clickable
                          @click="removeFromDownloading(scope.$index)"
                    ></Icon>
                    <!-- 进度 !-->
                    <div slot="append"
                         slot-scope="scope"
                    >
                        <el-progress :percentage="parseInt(scope.row.progress)"
                                     style="line-height: 46px;"
                        ></el-progress>
                    </div>
                </data-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import {mapState, mapMutations} from 'vuex'
    import {shell, remote} from 'electron'

    export default {
        data() {
            return {
                activeName: 'downloaded',
            }
        },
        computed: {
            ...mapState('download', ['downloaded', 'downloading']),
        },
        methods: {
            ...mapMutations('download', ['removeFromDownloaded', 'removeFromDownloading']),
            openDownloadFolder() {
                shell.showItemInFolder(`${remote.app.getPath('music')}/音乐湖`)
            }
        }
    }
</script>
<style lang="scss" module="s">
    .download {
        padding: 16px 24px;
        .top {
            position: relative;
            .title {
                font-size: 22px;
                color: $color-title;
            }
            .openDownloadFolder {
                color: $color-sub;
                font-size: 12px;
                position: absolute;
                z-index: 3;
                right: 0;
                bottom: -14px;
                transform: translateY(100%);
                cursor: pointer;
                &:hover {
                    color: $color-primary;
                }
            }
        }
        :global {
            .el-tabs__item {
                font-size: 14px;
            }
            .el-badge__content.is-fixed {
                top: 10px;
                right: 4px;
            }
        }
    }
</style>