<template>
    <menu-item title="本地歌曲扫描路径">
        <div :class="s.main">
            <span>{{setting.localSongsFolders.join('、')}}</span>
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
                        localSongsFolders: filePaths,
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