<template>
    <div id="app">
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { shell } from 'electron'

  export default {
    computed: {
      ...mapState('api', ['play'])
    },
    methods: {
      // 登录成功回调
      loginSuccessed(event, info) {
        console.log(info)
        // 更新userInfo
        this.$store.commit('user/update', {
          nickname: info.nickname,
          avatar: info.avatar
        })
        // 更新token
        this.$store.commit('token/update', info.token)
      },
    },
    created() {
      this.$ipc.on('loginSuccessed', this.loginSuccessed)
      // 状态栏 播放暂停
      this.$ipc.on('tray-control-pause', (event, pause) => {
        if (this.play.info) {
          this.$store.commit('api/updatePlay', {
            pause
          })
        }
      })
      // 状态栏 下一首
      this.$ipc.on('tray-control-next', () => {
        this.$store.dispatch('c_playlist/next')
      })
      this.$ipc.on('version_new', () => {
        this.$notify({
          dangerouslyUseHTMLString: true,
          message: '发现新版本 <a style="color:#2d8cf0;" class="go2Download" href="https://github.com/sunzongzheng/music/releases">前往下载页</a>'
        })
        const links = document.querySelectorAll('a[href].go2Download')

        Array.prototype.forEach.call(links, function (link) {
          const url = link.getAttribute('href')
          if (url.includes('https') || url.includes('http')) {
            link.addEventListener('click', function (e) {
              e.preventDefault()
              shell.openExternal(url)
            })
          }
        })
      })
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
