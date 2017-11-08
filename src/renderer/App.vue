<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    computed: {
      ...mapState('api', ['play'])
    },
    methods: {
      // 登录成功回调
      loginSuccessed (event, info) {
        console.log(info)
        // 更新userInfo
        this.$store.commit('user/update', {
          nickname: info.nickname,
          avatar: info.avatar
        })
        // 更新token
        this.$store.commit('token/update', info.token)
      },
      // 获取歌曲回调
      getSong (event, arg) {
        console.log(arg)
        if (arg.success) {
          let lyric = arg.lyric || []
          lyric = lyric.map(item => {
            let arr = item[0].match(/^(\d+):(\d+).(\d+)$/)
            if (arr) {
              item[0] = parseInt(arr[1]) * 60 * 1000 + parseInt(arr[2]) * 1000 + parseInt(arr[3].padEnd(3, '0'))
            }
            return item
          })
          this.$store.commit('api/updatePlay', {
            url: arg.file || arg.url,
            lyric,
            pause: false
          })
        } else {
          if (this.play.info.source === 'xiami' && this.play.info.file) {
            this.$store.commit('api/updatePlay', {
              url: this.play.info.file,
              lyric: [],
              pause: false
            })
          } else {
            this.$message({
              message: arg.message,
              type: 'warning'
            })
          }
        }
      },
      // 搜索歌曲回调
      searchSong (event, data) {
        console.log(data)
        let songList = {}
        let result = []
        let maxLength = 0
        for (let i in data) {
          songList[i] = data[i].songList || []
          const length = songList[i].length
          if (length > maxLength) {
            maxLength = length
          }
        }
        let cur = 0
        while (cur < maxLength) {
          for (let i in songList) {
            const item = songList[i][cur]
            if (item && !item.cp) {
              result.push({
                ...item,
                source: i
              })
            }
          }
          cur++
        }
        this.$store.commit('api/updateSearch', {
          result
        })
      }
    },
    created () {
      this.$ipc.on('loginSuccessed', this.loginSuccessed)
      this.$ipc.on('getSong', this.getSong)
      this.$ipc.on('searchSong', this.searchSong)
      if (localStorage.token) {
        this.$store.dispatch('user/init')
      }
    }
  }
</script>

<style>
    html,
    body {
        margin: 0;
        padding: 0;
        height: 100%;
        font-family: arial, "Hiragino Sans GB", "Microsoft YaHei",
        "WenQuanYi Micro Hei", sans-serif;
    }

    ul, li {
        margin: 0;
        padding: 0;
    }

    * {
        box-sizing: border-box;
    }

    #app {
        height: 100%;
        background-color: white;
        -webkit-app-region: no-drag;
    }

    ::-webkit-scrollbar {
        width: 4px;
        height: 8px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #e0e0e0;
    }
</style>
