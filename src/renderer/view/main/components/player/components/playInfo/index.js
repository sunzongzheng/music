import { mapState, mapGetters } from 'vuex'
import moment from 'moment'

export default {
  data() {
    return {
      duration: {
        cur: 0,
        total: 0
      },
      modal: false
    }
  },
  computed: {
    ...mapState('api', ['play']),
    ...mapState('user', ['info']),
    ...mapGetters('c_playlist', ['playlist']),
    ...mapState('lyrics', ['show', 'lyrics', 'activeIndex']),
    percentage() {
      return this.duration.total ? (this.duration.cur / this.duration.total) * 100 : 0
    }
  },
  watch: {
    'play.pause'(val) {
      this.$ipc.send('tray-control-pause-main', val)
      this.$nextTick(() => {
        const audio = this.$refs.audio
        if (val) {
          audio.pause()
        } else {
          audio.play()
        }
      })
    },
    'play.info'() {
      this.duration = {
        cur: 0,
        total: 0
      }
    },
    'play.volume'(val) {
      if (this.$refs.audio) {
        this.$refs.audio.volume = val / 100
      }
    }
  },
  filters: {
    minute(val) {
      return moment(val * 1000).format('mm:ss')
    }
  },
  methods: {
    async collect(id) {
      try {
        await this.$http.post(`/playlist/${id}`, {
          id: this.play.info.id,
          vendor: this.play.info.source,
          sourceData: this.play.info
        })
        this.$message({
          message: '添加成功',
          type: 'success'
        })
      } catch (e) {
        console.warn(e)
        this.$message({
          message: e.data.msg,
          type: 'warning'
        })
      }
    },
    toggleLyrics() {
      this.$store.commit('lyrics/update', {
        show: !this.show
      })
    },
    timeupdate() {
      const audio = this.$refs.audio
      this.duration = {
        cur: audio.currentTime,
        total: audio.duration || 0
      }
      // 计算歌词index
      const cur = Math.floor(audio.currentTime * 1000)
      const lyric = this.lyrics
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
      if (answer !== this.activeIndex) {
        this.$store.commit('lyrics/update', {
          activeIndex: answer
        })
      }
      // this.$store.commit('api/updatePlay', {
      //   time: Math.floor(audio.currentTime * 1000)
      // })
    },
    toggleList() {
      if (this.playlist.length) {
        this.$store.commit('c_playlist/toggle')
      }
    }
  },
  mounted() {
    this.$refs.audio.volume = this.play.volume / 100
  }
}
