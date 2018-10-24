<script type="text/jsx">
    import {mapState} from 'vuex'
    import cover from './components/cover.vue'
    import songInfo from './components/song-info/index.vue'
    import {remote} from 'electron'

    export default {
        components: {
            cover,
            songInfo
        },
        data() {
            return {
                backgroundWindowShow: false
            }
        },
        computed: {
            ...mapState('play', ['info']),
            ...mapState('c_playlist', ['playlist']),
            ...mapState('lyrics', ['show', 'lyrics', 'activeIndex'])
        },
        methods: {
            async collect(id) {
                try {
                    await this.$http.post(`/playlist/${id}`, {
                        id: this.info.id,
                        vendor: this.info.source,
                        sourceData: this.info
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
            toggleList() {
                if (this.playlist.length) {
                    this.$store.commit('c_playlist/toggle')
                }
            },
            showShareWindow() {
                this.$ipc.send('share', this.info)
            },
            toggleDesktopLyric() {
                this.$ipc.send('backgroundWindowStatusChange', !this.backgroundWindowShow)
            },
            judgeShowDesktopLyric() {
                if (this.backgroundWindowShow) {
                    remote.getGlobal('backgroundWindow').show()
                } else {
                    remote.getGlobal('backgroundWindow').hide()
                }
            }
        },
        created() {
            this.judgeShowDesktopLyric()
            this.$ipc.on('backgroundWindowStatusChange', (evnet, val) => {
                this.backgroundWindowShow = val
                this.judgeShowDesktopLyric()
            })
        },
        render(h) {
            return (
                <div class={{[this.s.info]: true, [this.s.lyric]: this.show}}>
                    <cover></cover>
                    <songInfo class={this.s.songInfo}></songInfo>
                    {
                        this.info ?
                            <add-to-playlist icon="add" class={this.s.icon} info={this.info}></add-to-playlist>
                            :
                            <icon type="add" class={this.s.icon} disabled={true}></icon>
                    }
                    <icon type="ci" class={{[this.s.icon]: true, [this.s.active]: this.backgroundWindowShow}}
                          onClick={this.toggleDesktopLyric}></icon>
                    <icon type="share"
                          class={this.s.icon}
                          onClick={this.showShareWindow}
                          disabled={!this.info}></icon>
                    <icon type="musiclist"
                          class={this.s.icon}
                          style="margin-top: 2px;"
                          disabled={!this.playlist.length}
                          onClick={this.toggleList}
                    ></icon>
                </div>
            )
        }
    }

</script>
<style lang="scss" module="s">
    .info {
        display: flex;
        align-items: center;
        width: calc(100% - 200px);
        height: 100%;
        background-color: white;
        border-top: 1px solid #EBEBEB;
        padding: 0 12px;
        .icon {
            color: #555;
            margin-right: 10px;
            cursor: pointer;
            -webkit-font-smoothing: antialiased;
            line-height: 1;
            &.active {
                color: $color-primary;
            }
        }
        &.lyric {
            background: transparent;
            border: none;
            .icon {
                color: white;
            }
            .cover {
                transform: rotate(180deg);
            }
        }
    }
</style>