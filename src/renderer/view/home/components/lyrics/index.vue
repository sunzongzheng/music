<template>
    <div :class="{[s.app]:true,[s.active]:show}">
        <div :class="s.wrap"></div>
        <div :class="s.cover" :style="style"></div>
        <ul :class="s.main" ref="main" @wheel="scrollBarWheel" v-if="play.lyric.length">
            <li v-for="(item,index) in play.lyric" :class="{[s.item]:true,[s.active]:activeIndex === index}">
                {{item[1]}}
            </li>
        </ul>
        <div :class="s.main" v-else>
            <span :class="[s.item,s.nolyric,s.active]">暂无歌词信息...</span>
        </div>
    </div>
</template>
<script>
  import { mapState } from 'vuex'
  import $ from 'jquery'

  export default {
    data () {
      return {
        userScrolling: false,
        timer: null
      }
    },
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
      },
      activeIndex () {
        const cur = this.play.time
        const lyric = this.play.lyric
        let answer = 0
        lyric.every((item, index) => {
          if (index < lyric.length - 1) { // 非最后一行
            if (cur >= lyric[index][0] && cur < lyric[index + 1][0]) {
              if (lyric[index][1].length) {
                answer = index
              } else {
                if (index === 0) {
                  answer = index
                } else {
                  answer = index - 1
                }
              }
              return false
            }
          } else if (cur >= lyric[index][0]) { // 最后一行 & 播放进度大于最后一行的时间
            answer = index
            return false
          }
          return true
        })
        // 跳转
        const main = this.$refs.main
        if (main && main.children[answer]) {
          if (!this.userScrolling) {
            $(main).clearQueue().stop().animate({
              scrollTop: main.children[answer].offsetTop - main.offsetHeight / 2
            }, 300, 'linear')
          }
        }

        return answer
      }
    },
    watch: {
      'play.info' () {
        console.log('change')
        this.$refs.main.scrollTop = 0
      }
    },
    methods: {
      close () {
        this.$store.commit('lyrics/update', {
          show: false
        })
      },
      scrollBarWheel () {
        this.userScrolling = true
        if (this.timer) {
          window.clearTimeout(this.timer)
        }
        this.timer = window.setTimeout(() => {
          this.userScrolling = false
        }, 2000)
      }
    }
  }
</script>
<style lang="scss" module="s">
    .app {
        position: fixed;
        z-index: 5;
        transform: translateY(100%);
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding-bottom: 60px;
        transition: all .4s;
        &.active {
            transition: all .4s;
            transform: translateY(0);
        }
        .wrap,
        .cover,
        .main {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
        }
        .wrap {
            z-index: 4;
            background-color: black;
        }
        .cover {
            z-index: 5;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
            filter: blur(35px);
            opacity: .3;
        }
        .main {
            z-index: 6;
            text-align: center;
            color: rgba(255, 255, 255, 0.9);
            overflow: auto;
            height: calc(100% - 60px);
            .item {
                padding: 8px 0;
                &.active {
                    color: #26B36C;
                }
            }
            .nolyric {
                display: inline-flex;
                margin-top: 20px;
            }
            &::-webkit-scrollbar {
                display: none;
            }
        }
    }
</style>