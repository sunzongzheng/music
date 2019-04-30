<template>
    <div :class="s.app">
        <view-control v-if="$config.platform === 'osx'"></view-control>
        <v-avatar></v-avatar>
        <div :class="s.main">
            <menu-section title="音乐馆">
                <icon-item route="/discover" icon="jingxuan" title="精选"></icon-item>
                <icon-item route="/rank" icon="paihang" title="排行"></icon-item>
                <icon-item route="/artist" icon="renren" title="歌手"></icon-item>
            </menu-section>
            <menu-section title="我的音乐">
                <icon-item route="/local-songs" icon="local" title="本地歌曲"
                           v-if="$config.aboveVersion('1.2.0')"></icon-item>
                <icon-item route="/download" icon="download" title="下载歌曲"></icon-item>
            </menu-section>
            <play-list></play-list>
            <offline-play-list></offline-play-list>
        </div>
    </div>
</template>
<script>
    import viewControl from './viewControl.vue'
    import vAvatar from './avatar/index.vue'
    import playList from './playlist/index.vue'
    import offlinePlayList from './offline-playlist/index.vue'
    import menuSection from './components/menu-section.vue'
    import iconItem from './components/icon-item.vue'

    export default {
        components: {vAvatar, viewControl, playList, offlinePlayList, menuSection, iconItem},
    }
</script>
<style lang="scss" module="s">
    .app {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: $leftmenu-width;
        height: 100%;
        background: linear-gradient(to bottom, #f6f6f6, #f2f2f2);
        -webkit-app-region: drag;
        .main {
            width: 100%;
            padding: 16px;
            height: calc(100% - 195px);
            overflow: auto;
            -webkit-app-region: no-drag;
        }
    }
</style>