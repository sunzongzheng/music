<template>
    <div :class="{[s.app]:true,[s.active]:show}" @click="close">
        <div :class="s.wrap"></div>
        <div :class="s.main" :style="style">

        </div>
    </div>
</template>
<script>
  import { mapState } from 'vuex'

  export default {
    computed: {
      ...mapState('lyrics', ['show']),
      ...mapState('api', ['play']),
      style () {
        if (this.play.info) {
          return {
            'background-image': `url(${this.play.info.album.coverBig})`
          }
        } else {
          return {}
        }
      }
    },
    methods: {
      close () {
        this.$store.commit('lyrics/update', {
          show: false
        })
      }
    }
  }
</script>
<style lang="scss" module="s">
    .app {
        position: fixed;
        z-index: 5;
        bottom: -100%;
        left: 0;
        width: 100%;
        height: 100%;
        padding-bottom: 60px;
        transition: bottom .3s;
        &.active {
            transition: bottom .3s;
            bottom: 0;
        }
        .wrap,
        .main {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
        }
        .wrap {
            z-index: 4;
            background-color: white;
        }
        .main {
            z-index: 5;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
            filter: blur(35px);
        }
    }
</style>