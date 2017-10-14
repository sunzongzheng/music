<template>
    <div :class="s.main">
        <div :class="s.control">
            <div :class="s.playControl">
                <Icon type="last"></Icon>
                <Icon :type="play.pause?'play':'plus-pause'" :class="s.play" @click="pauseChange"></Icon>
                <Icon type="last" :class="s.next"></Icon>
            </div>
            <Icon type="volume" :class="s.volume"></Icon>
            <Icon type="xunhuan" :class="s.volume"></Icon>
        </div>
        <div :class="s.info"></div>
        <audio :src="play.url" ref="audio" autoplay></audio>
    </div>
</template>
<script>
  import { mapState } from 'vuex'

  export default {
    computed: {
      ...mapState('api', ['play'])
    },
    watch: {
      'play.pause' (val) {
        if (val) {
          this.$refs.audio.$el.pause()
        } else {
          window.setTimeout(() => {
            this.$refs.audio.play()
          })
        }
      }
    },
    methods: {
      pauseChange () {
        this.$store.commit('api/pauseChange')
      }
    }
  }
</script>
<style lang="scss" module="s">
    .main {
        position: fixed;
        height: 50px;
        width: 100%;
        bottom: 0;
        left: 0;
        display: flex;
        align-items: center;
    }

    .control {
        display: flex;
        align-items: center;
        font-size: 28px;
        width: 200px;
        height: 100%;
        padding-left: 10px;
        justify-content: space-around;
        background-color: #EBEAEB;
        opacity: .6;
        .playControl {
            color: #26B36C;
            .play {
                font-size: 32px;
            }
            .next {
                transform: rotate(180deg);
            }
        }
        .volume {
            font-size: 20px;
        }
    }
</style>