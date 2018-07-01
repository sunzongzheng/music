import {mapState, mapActions} from 'vuex'
import Velocity from 'velocity-animate'

export default {
    data() {
        return {
            userScrolling: false,
            timer: null,
            showComment: false,
            singleLyric: '',
            placeholder: '暂无歌词信息...'
        }
    },
    computed: {
        ...mapState('lyrics', ['show', 'loading', 'lyrics', 'activeIndex']),
        ...mapState('api', ['play']),
        ...mapState('windowStatus', ['status']),
        style() {
            if (this.play.info) {
                return {
                    'background-image': `url(${Vue.filter('defaultAlbum')(this.play.info)})`
                }
            } else {
                return {}
            }
        },
        mainStyle() {
            return {
                width: this.showComment ? '60%' : '100%'
            }
        },
    },
    watch: {
        show(val) {
            if (val) {
                this.handleLyric()
            }
        },
        lyrics(val) {
            this.$nextTick(() => {
                if (this.$refs.main) {
                    Velocity(this.$refs.main, 'stop')
                    window.clearTimeout(this.timer)
                    this.$refs.main.scrollTop = 0
                }
            })
            this.handleLyric()
        },
        activeIndex() {
            this.handleLyric()
        }
    },
    methods: {
        ...mapActions('lyrics', ['init']),
        close() {
            this.$store.commit('lyrics/update', {
                show: false
            })
        },
        scrollBarWheel() {
            this.userScrolling = true
            if (this.timer) {
                window.clearTimeout(this.timer)
            }
            this.timer = window.setTimeout(() => {
                const main = this.$refs.main
                main.scrollTop = main.children[this.activeIndex].offsetTop - main.offsetHeight / 2
                this.userScrolling = false
            }, 2000)
        },
        op(val) {
            this.$store.commit('windowStatus/update', val)
        },
        transfer(index) {
            if (this.lyrics.length < 1) {
                this.$ipc.send('tray-control-lyrics', {
                    text: this.placeholder,
                    time: 0
                })
                return
            }
            const lyric = this.lyrics
            const singleLyric = lyric[index][1] // 单句歌词
            if (!singleLyric) return
            // 先计算当前句 和 下一句 的时间差
            let time = 0
            if (index === lyric.length - 1) { // 如果是最后一行 就默认10s吧，没有可靠的逻辑
                time = 10 * 1000
            } else {
                time = lyric[index + 1][0] - lyric[index][0]
            }
            this.$ipc.send('tray-control-lyrics', {
                text: singleLyric,
                time
            })
        },
        // 跳转至评论页
        go2Comments() {
            this.$router.push({
                name: 'song.comments',
                params: {
                    id: this.play.info.songId,
                },
                query: {
                    vendor: this.play.info.vendor
                }
            })
            this.$store.commit('lyrics/update', {
                show: false
            })
        },
        // 处理歌词
        handleLyric() {
            const main = this.$refs.main
            if (main && main.children[this.activeIndex]) {
                // 传递到状态栏
                this.transfer(this.activeIndex)
                const need = main.children[this.activeIndex].offsetTop - main.offsetHeight / 2
                // 是否打开了歌词面板
                if (this.show) {
                    // 判断是否用户处于滚动浏览中
                    if (!this.userScrolling) {
                        if (need !== main.scrollTop) {
                            Velocity(main, 'stop')
                            Velocity(main, 'scroll', {
                                container: main,
                                duration: 300,
                                offset: need - main.scrollTop
                            })
                        }
                    }
                } else { // 未打开的话则不用缓动歌词
                    Velocity(main, 'stop')
                    this.$nextTick(() => {
                        main.scrollTop = need
                    })
                }
            }
        }
    }
}