<template>
    <div :class="s.app">
        <view-control></view-control>
        <v-avatar></v-avatar>
        <div :class="s.main">
            <p :class="s.title">音乐馆</p>
            <ul>
                <router-link tag="li" to="/rank">
                    <Icon type="paihang"></Icon>
                    排行
                </router-link>
            </ul>
            <play-list></play-list>
            <offline-play-list></offline-play-list>
        </div>
    </div>
</template>
<script>
  import viewControl from './viewControl.vue'
  import vAvatar from './avatar.vue'
  import playList from './playlist/index.vue'
  import offlinePlayList from './offline-playlist/index.vue'

  export default {
    components: {vAvatar, viewControl, playList, offlinePlayList}
  }
</script>
<style lang="scss" module="s">
    .app {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, #f6f6f6, #f2f2f2);
        -webkit-app-region: drag;
        .main {
            width: 100%;
            padding: 16px;
            height: calc(100% - 195px);
            overflow: auto;
            -webkit-app-region: no-drag;
            .title {
                font-size: 12px;
                color: #8F8F8F;
            }
            ul {
                list-style: none;
                margin-bottom: 12px;
            }
            li {
                padding: 4px 8px;
                cursor: pointer;
                font-size: 13px;
                color: #333;
                &:hover {
                    background-color: rgba(222, 222, 222, 0.49);
                }
            }
        }
    }
</style>