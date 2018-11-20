<template>
    <div :class="s.leftMenu">
        <view-control style="margin-bottom: 12px;"></view-control>
        <menu-item name="Discover" route="/discover"></menu-item>
        <menu-item name="Playlist" route="/playlist"></menu-item>
        <menu-item name="Artist" route="/artist"></menu-item>
        <menu-title title="云歌单"></menu-title>
        <menu-item
            v-for="item in online"
            :key="item.id"
            :name="item.name"
            :route="{ name: 'playlist.online.detail', params: { id: item.id } }"
        ></menu-item>
        <menu-title title="我的音乐"></menu-title>
        <menu-item name="本地歌曲" route="/local-song"></menu-item>
        <menu-item name="下载歌曲" route="/downloaded-song"></menu-item>
        <menu-title title="离线歌单"></menu-title>
        <menu-item
            v-for="item in offline"
            :key="item.id"
            :name="item.name"
            :route="{
                name: 'playlist.offline.detail',
                params: { id: item.id },
            }"
        ></menu-item>
    </div>
</template>
<script>
import menuItem from './components/item.vue'
import menuTitle from './components/title.vue'
import viewControl from './components/viewControl.vue'
import { mapState } from 'vuex'

export default {
    components: {
        menuItem,
        menuTitle,
        viewControl,
    },
    computed: {
        ...mapState('user/playlist', ['online', 'offline']),
    },
}
</script>
<style lang="scss" module="s">
.leftMenu {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 180px;
    background: rgba(245, 245, 245, 0.98);
    -webkit-app-region: drag;
    padding: 8px 18px 16px;
}
</style>
