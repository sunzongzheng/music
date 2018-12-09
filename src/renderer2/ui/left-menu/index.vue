<template>
    <div :class="s.leftMenu">
        <view-control style="margin-bottom: 12px;"></view-control>
        <div :class="s.menus">
            <menu-title title="音乐馆"></menu-title>
            <menu-item name="Discover" route="/discover"></menu-item>
            <menu-item name="Rank" route="/rank"></menu-item>
            <menu-item name="Playlist" route="/playlists"></menu-item>
            <menu-item name="Artist" route="/artist"></menu-item>
            <menu-item name="MV" route="/mv"></menu-item>
            <template v-if="logged">
                <menu-title title="云歌单"></menu-title>
                <menu-item
                    v-for="item in online"
                    :key="item.id"
                    :name="item.name"
                    :route="{
                        name: 'music-lake-playlist.detail',
                        params: { id: item.id, type: 'online' },
                    }"
                ></menu-item>
            </template>
            <menu-title title="我的音乐"></menu-title>
            <menu-item name="本地歌曲" route="/local-song"></menu-item>
            <menu-item name="下载歌曲" route="/downloaded-song"></menu-item>
            <menu-title title="离线歌单"></menu-title>
            <menu-item
                v-for="item in offline"
                :key="item.id"
                :name="item.name"
                :route="{
                    name: 'music-lake-playlist.detail',
                    params: { id: item.id, type: 'offline' },
                }"
            ></menu-item>
        </div>
    </div>
</template>
<script>
import menuItem from './components/item.vue'
import menuTitle from './components/title.vue'
import viewControl from './components/viewControl.vue'
import { mapState, mapGetters } from 'vuex'

export default {
    components: {
        menuItem,
        menuTitle,
        viewControl,
    },
    computed: {
        ...mapState('user/playlist/online', {
            online: 'list',
        }),
        ...mapState('user/playlist/offline', {
            offline: 'list',
        }),
        ...mapGetters('user', ['logged']),
    },
}
</script>
<style lang="scss" module="s">
.leftMenu {
    display: flex;
    flex-direction: column;
    position: relative;
    width: $leftmenu-width;
    background: rgba(245, 245, 245, 0.98);
    padding: 8px 0 16px;
    height: calc(100% - #{$player-height});
    .menus {
        overflow: auto;
        padding: 0 18px;
    }
}
</style>
