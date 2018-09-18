<template>
    <div :class="s.app">
        <left-menu></left-menu>
        <div :class="s.right">
            <search-bar></search-bar>
            <div :class="s.main" ref="main">
                <router-view v-if="!refresh"></router-view>
            </div>
        </div>
        <player></player>
        <lyrics></lyrics>
        <play-list></play-list>
        <download-progress></download-progress>
    </div>
</template>
<script>
    import leftMenu from './view/components/leftMenu/index.vue'
    import searchBar from './view/components/searchBar/index.vue'
    import player from './view/components/player/index.vue'
    import lyrics from './view/components/lyrics/index.vue'
    import playList from './view/components/current_playlist/index.vue'
    import downloadProgress from './view/components/progress/index.vue'
    import eventBus from './eventBus/searchResult'
    import updateAlert from './view/components/updateAlert.vue'
    import {mapState, mapActions, mapMutations} from 'vuex'

    export default {
        components: {
            leftMenu,
            searchBar,
            player,
            lyrics,
            playList,
            downloadProgress
        },
        data() {
            return {
                refresh: false
            }
        },
        computed: {
            ...mapState('hot-key', ['hotKey', 'enableGlobal']),
            ...mapState('user', ['setting']),
            ...mapState('c_playlist', ['cycle']),
            ...mapState('play', ['volume']),
        },
        methods: {
            ...mapActions('c_playlist', ['last', 'next']),
            ...mapActions('download', {
                initDownload: 'init'
            }),
            ...mapMutations('c_playlist', ['cycleChange']),
            ...mapMutations('play', ['pauseChange', 'updateVolume']),
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
            // 有更新
            updateAlert() {
                console.log('updateAlert')
                const h = this.$createElement
                this.$notify({
                    title: '更新提示',
                    message: h(updateAlert),
                    duration: 0
                })
            },
            // 快捷键控制
            hotKeyControl(event, key) {
                switch (key) {
                    case 'playPause':
                        this.pauseChange()
                        break
                    case 'last':
                        this.last()
                        break
                    case 'next':
                        this.next()
                        break
                    case 'volumeIncrease':
                        this.updateVolume(this.volume + 10 > 100 ? 100 : this.volume + 10)
                        break
                    case 'volumeDecrease':
                        this.updateVolume(this.volume - 10 < 0 ? 0 : this.volume - 10)
                        break
                    case 'playModeChange':
                        this.cycleChange()
                        const text = {
                            list: '列表循环',
                            random: '随机播放',
                            single: '单曲循环'
                        }[this.cycle]
                        let notification = new Notification('播放模式切换', {
                            body: text
                        })
                        setTimeout(() => {
                            notification.close()
                        }, 2000)
                        break
                }
            }
        },
        watch: {
            '$route'() {
                this.$refs.main.scrollTop = 0
            }
        },
        created() {
            Vue.$store.dispatch('offline-playlist/init') // 初始化离线歌单
            this.$ipc.on('loginSuccessed', this.loginSuccessed) // 监听登录成功
            this.$ipc.on('update-alert', this.updateAlert) // 监听版本更新
            this.$ipc.send('register-hotKey', {
                hotKey: this.hotKey,
                enableGlobal: this.enableGlobal
            })
            this.$ipc.send('toggle-tray', this.setting.macStatusBar)
            this.$ipc.send('tray-control-volume', this.volume)
            this.$ipc.on('hotKey-control', this.hotKeyControl)
            if (localStorage.token) {
                this.$store.dispatch('user/init')
            }
            if (!['add-to-playlist', 'share'].includes(this.$route.name)) {
                Vue.$socket.connect() // 连接 socket
            }
            eventBus.$on('refresh', () => {
                this.refresh = true
                this.$nextTick(() => {
                    this.refresh = false
                })
            })
            this.initDownload()
            setTimeout(() => {
                this.$updater.__judgeUpdater(this.setting.linuxAutoUpdate)
            }, 5000)
        },
        beforeDestroy() {
            Vue.$socket.disconnect()
        }
    }
</script>
<style lang="scss">
    html,
    body {
        margin: 0;
        padding: 0;
        height: 100%;
        font-family: arial, "Hiragino Sans GB", "Microsoft YaHei",
        "WenQuanYi Micro Hei", sans-serif;
        background: white;
    }

    ul, li {
        margin: 0;
        padding: 0;
    }

    ul {
        list-style: none;
    }

    p {
        margin: 0;
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
        width: 8px;
        height: 8px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #e0e0e0;
    }

    a {
        color: $color-primary;
        cursor: pointer;
        text-decoration: none;
        &:hover {
            color: #4cdc96;
        }
    }
</style>

<style lang="scss" module="s">
    .app {
        display: flex;
        flex-flow: row wrap;
        height: 100%;
        position: relative;
        overflow: hidden;
        .right {
            width: calc(100% - #{$leftmenu-width});
            padding-bottom: 60px;
        }

        .main {
            height: calc(100% - #{$searchBar-height});
            overflow: auto;
        }
    }
</style>