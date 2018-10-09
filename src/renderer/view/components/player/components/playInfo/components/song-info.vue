<script type="text/jsx">
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
                        if(!pause) {
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
                    quality: this.quality
                }))
            }
            let last = localStorage.getItem('last-play-song')
            if (last) {
                last = JSON.parse(last)
                if (last.song) {
                    this.update({
                        info: last.song,
                        quality: last.quality
                    })
                    this.$store.commit('c_playlist/update', last.playlist || [])
                    this.$nextTick(() => {
                        this.$refs.audio.currentTime = last.progress
                    })
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
        },
        render(h) {
            return (
                <div class={{ [this.s.songsInfo]: true, [this.s.lyric]: this.show }}>
                    <div class={this.s.song}>
                        {
                            this.info ?
                                <div class={this.s.info}>
                                    <span class={this.s.name}>{this.info.name}</span>
                                    <span>&nbsp;-&nbsp;</span>
                                    <span class={this.s.singer}>
                                        {
                                            this.info.artists.map(item => {
                                                return (
                                                    item.name
                                                )
                                            })
                                        }
                                    </span>
                                </div>
                                :
                                <div class={this.s.info}>
                                    <span class={this.s.placeholder}>听你想听的音乐</span>
                                </div>
                        }
                        <div class={this.s.right}>
                            <el-popover placement="top"
                                        width="80"
                                        trigger="click"
                                        popper-class={this.s.qualityPopover}
                            >
                                <ul>
                                    {
                                        this.qualities.map((item, index) => {
                                            return (
                                                <li class={{ [this.s.disabled]: item.disabled }}
                                                    onClick={() => this.changeQuality(index)}
                                                >
                                                    {
                                                        item.checked ? (
                                                            <icon type="right"
                                                                  class={this.s.checked}>&radic;</icon>) : null
                                                    }
                                                    <span>{item.name}</span>
                                                    {
                                                        item.br >= 320000 ? (
                                                            <quality class={this.s.quality}
                                                                     sq={item.br === 999000}
                                                            ></quality>
                                                        ) : null
                                                    }
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                                <div class={this.s.quality} slot="reference">{this.qualityText}</div>
                            </el-popover>
                            <span class={this.s.duration}>
                                {this.minute(this.duration.cur)}&nbsp;/&nbsp;{this.minute(this.duration.total)}
                            </span>
                        </div>
                    </div>
                    <el-slider onInput={val => {
                        this.percentage = val
                    }}
                               value={this.percentage}
                               class={this.s.progress}
                               onChange={this.pregressChange}
                               disabled={!this.duration.total}
                    ></el-slider>
                    <audio src={this.url}
                           ref="audio"
                           preload="true"
                           onTimeupdate={() => this.timeupdate()}
                           onCanplay={this.canPlay}
                           onEnded={() => this.$store.dispatch('c_playlist/next', true)}
                           onError={() => this.$store.dispatch('c_playlist/next', true)}
                    ></audio>
                </div>
            )
        },
    }
</script>
<style lang="scss" module="s">
    .songsInfo {
        display: flex;
        flex-direction: column;
        width: calc(100% - 35px - 108px);
        font-size: 12px;
        color: gray;
        margin-left: 10px;
        margin-right: 20px;
        margin-top: 4px;
        .song {
            position: relative;
            .info {
                display: flex;
                align-items: center;
                .placeholder {
                    font-size: 13px;
                }
                .name {
                    color: #333;
                    font-size: 13px;
                    max-width: 150px;
                    @include text-ellipsis;
                }
                .singer {
                    display: inline-block;
                    max-width: 300px;
                    vertical-align: top;
                    @include text-ellipsis;
                }
            }
            .right {
                position: absolute;
                right: 0;
                bottom: 0;
                display: flex;
                align-items: center;
                .quality {
                    color: $color-content;
                    padding: 1px 2px;
                    border: 1px solid $color-content;
                    font-size: 10px;
                    line-height: 1;
                    cursor: pointer;
                    opacity: .4;
                    transition: opacity .2s;
                    margin-right: 16px;
                    &:hover {
                        color: $color-title;
                        border-color: $color-title;
                    }
                }
            }
        }
        .progress {
            :global {
                .el-slider__runway {
                    margin: 6px 0;
                    height: 6px;
                    user-select: none;
                    background: linear-gradient(to bottom, #e4e7ed 0, #e4e7ed 2px, transparent 2px);
                    border-radius: 0;
                    .el-slider__bar {
                        height: 6px;
                        background: linear-gradient(to bottom, #3AC17E 0, #3AC17E 2px, transparent 2px);
                        border-radius: 0;
                    }
                    .el-slider__button-wrapper {
                        height: 32px;
                        width: 32px;
                        outline: none;
                    }
                    .el-slider__button {
                        display: none;
                        width: 8px;
                        height: 8px;
                        border: 2px solid #3AC17E;
                        background-color: #3AC17E;
                        outline: none;
                    }
                    &:hover {
                        .el-slider__button {
                            display: inline-block;
                        }
                    }
                }
            }
        }
        &.lyric {
            color: white;
            & > .song {
                .name,
                .quality {
                    color: white;
                }
                .quality {
                    border-color: white;
                    &:hover {
                        color: white;
                        border-color: white;
                    }
                }
            }
        }
        &:hover {
            .song .right .quality {
                opacity: 1;
                transition: opacity .2s;
            }
        }
    }

    .qualityPopover {
        padding: 0;
        ul {
            li {
                font-size: 14px;
                padding: 8px 0 8px 40px;
                cursor: pointer;
                position: relative;
                .checked {
                    position: absolute;
                    left: 16px;
                    font-size: 16px;
                    top: 9px;
                }
                &:hover {
                    background: #f9f9f9;
                }
                &.disabled {
                    cursor: not-allowed;
                    opacity: .5;
                }
                .quality {
                    position: absolute;
                    right: 24px;
                    top: 10px;
                }
            }
        }
    }
</style>