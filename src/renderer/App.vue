<template>
    <div :class="s.app">
        <!--<left-menu></left-menu>-->
        <!--<div :class="s.right">-->
        <!--<search-bar></search-bar>-->
        <!--<div :class="s.main" ref="main">-->
        <!--<keep-alive :include="cacheList">-->
        <!--<router-view v-if="!refresh"></router-view>-->
        <!--</keep-alive>-->
        <!--</div>-->
        <!--</div>-->
        <!--<player></player>-->
        <!--<lyrics></lyrics>-->
        <!--<play-list></play-list>-->
        <!--<download-progress></download-progress>-->
        <div :class="s.alert">
            <p>由于受到QQ音乐、网易云音乐的警告函，现已关闭服务</p>
            <p>如果您需要导出云歌单，请点击<a v-popover:popover>此链接</a></p>
        </div>
        <el-popover :popper-class="s.avatarPopover"
                    placement="bottom"
                    ref="popover"
                    trigger="click"
        >
            <div :class="s.loginMethod">
                <div @click="showLoginDialog('qq')">
                    <Icon type="QQ"></Icon>
                    <span>QQ登录</span>
                </div>
                <div @click="showLoginDialog('weibo')">
                    <Icon type="weibo"></Icon>
                    <span>微博登录</span>
                </div>
            </div>
        </el-popover>
        <el-dialog
                title="请选择要导出的歌单"
                :visible.sync="modal.exportPlaylist"
                width="30%"
        >
            <el-select v-model="chosenPlaylist" placeholder="请选择" style="width: 100%">
                <el-option
                        v-for="item in playlist"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
            </el-select>
            <div slot="footer" class="dialog-footer">
                <el-button @click="modal.exportPlaylist = false">取 消</el-button>
                <el-button type="primary" @click="exportPlaylist" :loading="loading.exportPlaylist">确 定</el-button>
            </div>
        </el-dialog>
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
    import { mapState, mapActions, mapMutations } from 'vuex'
    import weiboLogin from './view/components/leftMenu/avatar/weibo-login'
    import xlsx from 'xlsx'

    export default {
        components: {
            leftMenu,
            searchBar,
            player,
            lyrics,
            playList,
            downloadProgress,
        },
        data() {
            return {
                refresh: false,
                cacheList: [
                    'rank',
                ],
                modal: {
                    exportPlaylist: false,
                },
                playlist: [],
                chosenPlaylist: null,
                loading: {
                    exportPlaylist: false,
                },
            }
        },
        computed: {
            ...mapState('hot-key', ['hotKey', 'enableGlobal']),
            ...mapState('user', ['setting', 'info']),
            ...mapState('c_playlist', ['cycle']),
            ...mapState('play', ['volume']),
        },
        methods: {
            ...mapActions('c_playlist', ['last', 'next']),
            ...mapActions('user', ['checkNeteaseBindAvalible', 'checkQQBindAvalible']),
            ...mapActions('download', {
                initDownload: 'init',
            }),
            ...mapActions('menu', {
                initMenu: 'init',
            }),
            ...mapActions('hot-key', ['initGlobalShortcut']),
            ...mapMutations('c_playlist', ['cycleChange']),
            ...mapMutations('play', ['pauseChange', 'updateVolume']),
            // 登录成功回调
            loginSuccessed(event, info) {
                console.log(info)
                // 更新userInfo
                this.$store.commit('user/update', {
                    nickname: info.nickname,
                    avatar: info.avatar,
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
                    duration: 0,
                })
            },
            showLoginDialog(type) {
                if (type === 'qq') {
                    this.$ipc.send('login')
                } else {
                    weiboLogin.init()
                }
            },
            async getPlaylist() {
                const loading = this.$loading({
                    lock: true,
                    text: '正在获取歌单',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)',
                })
                try {
                    this.playlist = await Vue.$http.get('/playlist')
                } catch (e) {
                }
                loading.close()
            },
            async exportPlaylist() {
                if (this.chosenPlaylist === null) {
                    this.$message.warning('请选择歌单')
                    return
                }
                this.loading.exportPlaylist = true
                try {
                    const list = await this.$http.get(`playlist/${this.chosenPlaylist}`)
                    const workbook = xlsx.utils.book_new()
                    const worksheet = xlsx.utils.json_to_sheet(
                        list.map(item => {
                            return {
                                '歌曲名称': item.name,
                                '专辑名': item.album.name,
                                '歌手': item.artists[0].name,
                                '来源平台': {
                                    qq: 'QQ音乐',
                                    netease: '网易云音乐',
                                    xiami: '虾米音乐',
                                }[item.vendor],
                            }
                        }),
                    )
                    const playlistName = this.playlist.find(item => item.id === this.chosenPlaylist).name
                    xlsx.utils.book_append_sheet(workbook, worksheet, playlistName)
                    const s2ab = function(s) { // 字符串转字符流
                        const buf = new ArrayBuffer(s.length)
                        const view = new Uint8Array(buf)
                        for (let i = 0; i !== s.length; ++i) {
                            view[i] = s.charCodeAt(i) & 0xFF
                        }
                        return buf
                    }
                    // 创建二进制对象写入转换好的字节流
                    let tmpDown = new Blob([s2ab(xlsx.write(workbook, {
                        bookType: 'xlsx',
                        bookSST: false,
                        type: 'binary',
                    }))], { type: '' })
                    let a = document.createElement('a')
                    // 利用URL.createObjectURL()方法为a元素生成blob URL
                    a.href = URL.createObjectURL(tmpDown)  // 创建对象超链接
                    a.download = `${playlistName}.xls`
                    a.click()
                } catch (e) {
                    console.warn(e)
                }
                this.loading.exportPlaylist = false
            },
        },
        watch: {
            '$route'() {
                this.$refs.main.scrollTop = 0
            },
            info(val) {
                if (val) {
                    this.modal.exportPlaylist = true
                    this.getPlaylist()
                }
            },
        },
        created() {
            Vue.$store.dispatch('offline-playlist/init') // 初始化离线歌单
            this.$ipc.on('loginSuccessed', this.loginSuccessed) // 监听登录成功
            this.$ipc.on('update-alert', this.updateAlert) // 监听版本更新
            this.$ipc.send('toggle-tray', this.setting.macStatusBar)
            this.$ipc.send('tray-control-volume', this.volume)
            // if (localStorage.token) {
            //     this.$store.dispatch('user/init')
            // }
            // if (!['add-to-playlist', 'share'].includes(this.$route.name)) {
            //     Vue.$socket.connect() // 连接 socket
            // }
            // eventBus.$on('refresh', () => {
            //     this.refresh = true
            //     this.$nextTick(() => {
            //         this.refresh = false
            //     })
            // })
            // this.initMenu()
            // this.initGlobalShortcut()
            // this.initDownload()
            // this.checkNeteaseBindAvalible()
            // this.checkQQBindAvalible()
            // setTimeout(() => {
            //     this.$updater.__judgeUpdater(this.setting.linuxAutoUpdate)
            // }, 5000)
        },
        mounted() {
            document.body.querySelector('#page-loading').style.display = 'none'
        },
        beforeDestroy() {
            Vue.$socket.disconnect()
        },
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
        .alert {
            position: fixed;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            z-index: 100;
            background: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
    }

    .avatarPopover {
        -webkit-app-region: no-drag;
        span {
            font-size: 12px;
            cursor: pointer;
            &:hover {
                color: #26B36C;
            }
        }
        .loginMethod {
            display: flex;
            justify-content: space-around;
            & > div {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 0 12px;
                svg {
                    font-size: 32px;
                    cursor: pointer;
                }
                span {
                    margin-top: 8px;
                }
                &:hover {
                    opacity: .8;
                }
            }
        }
    }
</style>