<script type="text/jsx">
    import {mapState} from 'vuex'
    import eventBus from '@/eventBus/playlist'
    import cover from './components/cover.vue'
    import songInfo from './components/song-info.vue'

    export default {
        components: {
            cover,
            songInfo
        },
        computed: {
            ...mapState('play', ['info']),
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
                if (eventBus.playlist.length) {
                    this.$store.commit('c_playlist/toggle')
                }
            },
            showShareWindow() {
                this.$ipc.send('share', this.info)
            }
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
                    <icon type="share"
                          class={this.s.icon}
                          onClick={this.showShareWindow}
                          disabled={!this.info}></icon>
                    <icon type="musiclist"
                          class={this.s.icon}
                          style="margin-top: 2px;"
                          disabled={!eventBus.playlist.length}
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
        user-select: none;
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
        .icon {
            color: #555;
            margin-right: 10px;
            cursor: pointer;
        }
    }
</style>