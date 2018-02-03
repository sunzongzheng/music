<template>
    <div :class="s.app">
        <left-menu style="width: 200px;"></left-menu>
        <div :class="s.right">
            <search-bar :class="s.searchBar"></search-bar>
            <div :class="s.main" ref="main">
                <keep-alive include="rankMain,rankDetail">
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>
        <player :class="s.player"></player>
        <transition :enter-class="s.slideTop_enter"
                    :enter-active-class="s.slideTop_enter_active"
                    :leave-to-class="s.slideTop_leave_to"
                    :leave-active-class="s.slideTop_leave_active"
        >
            <lyrics v-show="show"></lyrics>
        </transition>
        <play-list></play-list>
    </div>
</template>
<script>
  import leftMenu from './components/leftMenu/index.vue'
  import searchBar from './components/searchBar/index.vue'
  import player from './components/player/index.vue'
  import lyrics from './components/lyrics/index.vue'
  import playList from './components/current_playlist/index.vue'
  import { mapState } from 'vuex'

  export default {
    components: {
      leftMenu,
      searchBar,
      player,
      lyrics,
      playList
    },
    computed: {
      ...mapState('lyrics', ['show']),
    },
    beforeRouteUpdate(to, from, next) {
      this.$refs.main.scrollTop = 0
      next()
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

    .slideTop_enter_active, .slideTop_leave_active {
        transform: translate3d(0, 0, 0);
    }

    .slideTop_enter, .slideTop_leave_to {
        transform: translate3d(0, 100%, 0);
    }
</style>