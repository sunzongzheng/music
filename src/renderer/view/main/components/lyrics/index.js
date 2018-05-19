import {mapState} from 'vuex'
import Velocity from 'velocity-animate'
import {remote} from 'electron'

const setLyric = remote.getGlobal('setLyric')

export default {
    data() {
        return {
            userScrolling: false,
            timer: null,
            showComment: false,
            singleLyric: ''
        }
    },
    computed: {
        ...mapState('lyrics', ['show', 'loading', 'lyrics', 'activeIndex']),
        ...mapState('api', ['play']),
        ...mapState('windowStatus', ['status']),
        style() {
            if (this.play.info) {
                return {
                    'background-image': `url(${this.play.info.album.cover})`
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
        lyrics() {
            this.$nextTick(() => {
                if (this.$refs.main) {
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
        async transfer(index) {
            const lyric = this.lyrics
            const singleLyric = lyric[index][1] // 单句歌词
            // 先计算当前句 和 下一句 的时间差
            let time = 0
            if (index === lyric.length - 1) { // 如果是最后一行 就默认10s吧，没有可靠的逻辑
                time = 10 * 1000
            } else {
                time = lyric[index + 1][0] - lyric[index][0]
            }
            return this.$ipc.send('tray-control-lyrics', {
                text: singleLyric,
                time
            })
        },
        // 跳转至评论页
        go2Comments() {
            this.$router.push({
                name: 'song.comments',
                params: {
                    id: this.play.info.id,
                },
                query: {
                    vendor: this.play.info.source
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