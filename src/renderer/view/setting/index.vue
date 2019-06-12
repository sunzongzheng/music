<template>
    <div :class="s.setting">
        <p :class="s.title">设置</p>
        <bind></bind>
        <quality></quality>
        <linux-auto-update v-if="platform === 'linux'"></linux-auto-update>
        <top-menu v-if="platform === 'darwin'"></top-menu>
        <hot-key></hot-key>
        <local-songs-folder></local-songs-folder>
        <proxy></proxy>
        <statistics></statistics>
        <version></version>
        <debug></debug>
    </div>
</template>
<script>
    import menuItem from './components/menu-item.vue'
    import hotKey from './components/hot-key.vue'
    import topMenu from './components/topMenu.vue'
    import linuxAutoUpdate from './components/linuxAutoUpdate.vue'
    import version from './components/version.vue'
    import statistics from './components/statictics.vue'
    import debug from './components/debug.vue'
    import messageAlert from './components/message-alert.vue'
    import quality from './components/quality.vue'
    import bind from './components/bind/index.vue'
    import localSongsFolder from './components/local-songs-folder.vue'
    import proxy from './components/proxy.vue'

    export default {
        components: {
            topMenu,
            menuItem,
            hotKey,
            linuxAutoUpdate,
            version,
            statistics,
            debug,
            messageAlert,
            quality,
            bind,
            localSongsFolder,
            proxy
        },
        computed: {
            platform() {
                switch (process.platform) {
                    case 'darwin':
                        return 'darwin'
                    case 'win32':
                        return 'win32'
                    default:
                        return 'linux'
                }
            }
        }
    }
</script>
<style lang="scss" module="s">
    .setting {
        padding: 24px;
        font-size: 13px;
        color: $color-content;
        .title {
            font-size: 20px;
            color: $color-title;
            padding-bottom: 16px;
            border-bottom: 1px solid $color-border4;
        }
    }
</style>