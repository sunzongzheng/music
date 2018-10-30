import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
import moment from 'moment'

export default {
    data() {
        return {
            duration: {
                cur: 0,
                total: 0,
            },
            percentage: 0,
            qualities: [
                {
                    name: '标准品质',
                    checked: true,
                    disabled: false,
                    br: 128000,
                },
                {
                    name: '较高品质',
                    checked: false,
                    disabled: true,
                    br: 192000,
                },
                {
                    name: '极高品质',
                    checked: false,
                    disabled: true,
                    br: 320000,
                },
                {
                    name: '无损品质',
                    checked: false,
                    disabled: true,
                    br: 999000,
                },
            ],
        }
    },
    computed: {
        ...mapState('play', ['pause', 'info', 'volume', 'url', 'quality']),
        ...mapState('c_playlist', ['playlist']),
        ...mapState('lyrics', ['show', 'lyrics', 'activeIndex']),
        ...mapGetters('play', ['hasHigherQuality']),
        qualityText() {
            return this.qualities.filter(item => item.checked)[0].name
        },
    },
    watch: {
        'pause'(val) {
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
        'info'(val) {
            this.duration = {
                cur: 0,
                total: 0,
            }
        },
        url(val) {
            if (val) {
                this.qualities = this.qualities.map((item, i) => {
                    if (item.br === this.quality) {
                        item.checked = true
                    } else {
                        item.checked = false
                    }
                    const quality = this.info.quality
                    if (quality) {
                        switch (i) {
                            case 1:
                                item.disabled = !quality['192']
                                break
                            case 2:
                                item.disabled = !quality['320']
                                break
                            case 3:
                                item.disabled = !quality['999']
                                break
                        }
                    } else {
                        item.disabled = true
                    }
                    if (i === 0) {
                        item.disabled = false
                    }
                    return item
                })
            }
        },
        'volume'(val) {
            if (this.$refs.audio) {
                this.$refs.audio.volume = val / 100
            }
        },
        'duration': {
            deep: true,
            handler() {
                this.setPercentage()
            },
        },
    },
    methods: {
        ...mapMutations('play', ['update']),
        ...mapActions('play', ['setQuality']),
        ...mapActions('c_playlist', ['next']),
        timeupdate() {
            // 此处解决audio暂停是异步 清空播放状态后 timeupdate 仍会emit出来的问题
            if (!this.url) {
                return
            }
            const audio = this.$refs.audio
            this.duration = {
                cur: audio.currentTime,
                total: audio.duration || 0,
            }
            this.calcIndex()
        },
        // 计算歌词index
        calcIndex() {
            const audio = this.$refs.audio
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
                    activeIndex: answer,
                })
            }
        },
        setPercentage() {
            this.percentage = this.duration.total ? (this.duration.cur / this.duration.total) * 100 : 0
            this.$ipc.send('tray-control-progress', this.percentage)
        },
        pregressChange(val) {
            this.$refs.audio && (this.$refs.audio.currentTime = val * this.duration.total / 100)
        },
        minute(val) {
            return moment(val * 1000).format('mm:ss')
        },
        canPlay() {
            this.duration.total = this.$refs.audio.duration
        },
        async changeQuality(index) {
            if (this.qualities[index].disabled || this.qualities[index].checked) return
            const data = await Vue.$musicApi.getSongUrl(this.info.vendor, this.info.songId, this.qualities[index].br)
            if (data.status) {
                // 先记录当前播放位置和播放状态
                const currentTime = this.$refs.audio.currentTime
                const pause = this.pause
                // 然后暂停并替换url
                this.update({
                    pause: true,
                    url: data.data.url,
                    quality: this.qualities[index].br,
                })
                this.$nextTick(() => {
                    // 恢复播放位置
                    this.$refs.audio.currentTime = currentTime
                    // 切换前是播放中的话 恢复播放
                    if (!pause) {
                        this.update({
                            pause: false,
                        })
                    }
                })
            } else {
                console.log(data)
                Vue.$message.warning(data.msg)
            }
        },
        audioError(e) {
            const qualities = this.qualities.map(item => item.br)
            const curIndex = qualities.indexOf(this.quality)
            if (curIndex > 0) { // 高品质无法播放 且有较低资源 选择次级资源
                for (let i = curIndex - 1; i >= 0; i--) {
                    if (this.qualities[i].disabled) {
                        continue
                    } else {
                        this.changeQuality(i)
                        break
                    }
                }
            } else { // 否则直接跳下一首
                this.next(true)
            }
        },
    },
    mounted() {
        this.$refs.audio.volume = this.volume / 100
    },
    async created() {
        this.$ipc.on('tray-control-progress', (event, val) => {
            this.pregressChange(val)
        })
        window.onbeforeunload = (e) => {
            localStorage.setItem('last-play-song', JSON.stringify({
                song: this.info,
                playlist: this.playlist,
                progress: this.duration.cur,
                quality: this.quality,
            }))
        }
        let last = localStorage.getItem('last-play-song')
        if (last) {
            last = JSON.parse(last)
            if (last.song) {
                this.update({
                    info: last.song,
                    quality: last.quality,
                })
                this.$store.commit('c_playlist/update', last.playlist || [])
                this.$nextTick(() => {
                    this.$refs.audio.currentTime = last.progress
                })
                if (last.song.fullpath) {
                    this.update({
                        url: `file://${last.song.fullpath}`,
                    })
                } else {
                    let data = await Vue.$musicApi.getSongUrl(last.song.vendor, last.song.songId, last.quality)
                    if (data.status) {
                        let url = data.data.url
                        if (url) {
                            url = url.startsWith('http') ? url : ('http://' + url)
                        }
                        this.update({
                            url,
                        })
                        await Vue.$store.dispatch('lyrics/init')
                        this.calcIndex()
                    } else {
                        console.warn(data)
                    }
                }
            }
        }
    },
}