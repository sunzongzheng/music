<script type="text/jsx">
    import {mapState} from 'vuex'
    import moment from 'moment'

    export default {
        data() {
            return {
                duration: {
                    cur: 0,
                    total: 0
                },
                percentage: 0
            }
        },
        computed: {
            ...mapState('play', ['pause', 'info', 'volume', 'url']),
            ...mapState('lyrics', ['show', 'lyrics', 'activeIndex'])
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
            'info'() {
                this.duration = {
                    cur: 0,
                    total: 0
                }
            },
            'volume'(val) {
                if (this.$refs.audio) {
                    this.$refs.audio.volume = val / 100
                }
            },
            'duration.total'() {
                this.setPercentage()
            },
            'duration.cur'() {
                this.setPercentage()
            }
        },
        methods: {
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
            },
            setPercentage() {
                this.percentage = this.duration.total ? (this.duration.cur / this.duration.total) * 100 : 0
            },
            pregressChange(val) {
                this.$refs.audio && (this.$refs.audio.currentTime = val * this.duration.total / 100)
            },
            minute(val) {
                return moment(val * 1000).format('mm:ss')
            }
        },
        mounted() {
            console.log(this.$refs.audio)
            this.$refs.audio.volume = this.volume / 100
        },
        render(h) {
            return (
                <div class={{[this.s.songsInfo]: true, [this.s.lyric]: this.show}}>
                    <div class={this.s.song}>
                        {
                            this.url ?
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
                                '听你想听的音乐'
                        }
                        <span class={this.s.duration}>
                            {this.minute(this.duration.cur)}&nbsp;/&nbsp;{this.minute(this.duration.total)}
                        </span>
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
                           onEnded={() => this.$store.dispatch('c_playlist/next')}
                           onError={() => this.$store.dispatch('c_playlist/next')}
                    ></audio>
                </div>
            )
        }
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
        .song {
            position: relative;
            .info {
                display: flex;
                align-items: center;
                & > span {
                    line-height: 1;
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
            .duration {
                position: absolute;
                right: 0;
                bottom: 0;
            }
        }
        .progress {
            :global {
                .el-slider__runway {
                    margin: 6px 0;
                    height: 2px;
                    user-select: none;
                    .el-slider__bar {
                        height: 2px;
                        background-color: #3AC17E;
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
            & > .song .name {
                color: white;
            }
        }
    }
</style>