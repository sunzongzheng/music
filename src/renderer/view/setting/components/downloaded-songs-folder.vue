<template>
    <menu-item title="下载歌曲目录">
        <div :class="s.main">
            <span>{{setting.downloadedSongsFolders}}</span>
            <i class="el-icon-edit-outline" @click="choose"></i>
        </div>
    </menu-item>
</template>
<script>
    import menuItem from './menu-item.vue'
    import { mapState, mapMutations } from 'vuex'
    import { remote } from 'electron'

    const { dialog } = remote

    export default {
        components: {
            menuItem,
        },
        computed: {
            ...mapState('user', ['setting']),
        },
        methods: {
            ...mapMutations('user', ['updateSetting']),
            choose() {
                dialog.showOpenDialog({
                    properties: ['openDirectory'],
                }, (filePaths) => {
                    this.updateSetting({
                        downloadedSongsFolders: filePaths[0],
                    })
                })
            },
        },
    }
</script>
<style lang="scss" module="s">
    .main {
        display: flex;
        align-items: center;
        i {
            margin-left: 8px;
            cursor: pointer;
            &:hover {
                color: $color-primary;
            }
        }
    }
</style>