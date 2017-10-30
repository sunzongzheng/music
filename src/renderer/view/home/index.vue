<template>
    <div :class="s.app">
        <left-menu style="width: 200px;"></left-menu>
        <div :class="s.right">
            <search-bar :class="s.searchBar"></search-bar>
            <div :class="s.main">
                <router-view></router-view>
            </div>
        </div>
        <player :class="s.player"></player>
        <lyrics></lyrics>
    </div>
</template>
<script>
  import leftMenu from './components/leftMenu/index.vue'
  import searchBar from './components/searchBar/index.vue'
  import player from './components/player/index.vue'
  import lyrics from './components/lyrics/index.vue'

  export default {
    components: {
      leftMenu,
      searchBar,
      player,
      lyrics
    }
  }
</script>
<style lang="scss" module="s">
    .app {
        display: flex;
        flex-flow: row wrap;
        height: 100%;
    }

    .right {
        width: calc(100% - 200px);
        padding-bottom: 60px;
    }

    .searchBar {
        height: 45px;
    }

    .main {
        height: calc(100% - 45px);
        overflow: auto;
    }
</style>