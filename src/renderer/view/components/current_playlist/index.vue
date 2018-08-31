<script type="text/jsx">
    import Clickoutside from 'element-ui/src/utils/clickoutside'
    import {mapState, mapActions} from 'vuex'
    import eventBus from '@/eventBus/playlist'
    import Vue from 'vue'
    import _ from 'lodash'

    let playlistRenderCache = null
    let playlistCache = []
    export default {
        directives: {Clickoutside},
        data() {
            return {
                strategy: 'cache', // cache || complete || toggle
            }
        },
        computed: {
            ...mapState('c_playlist', ['show']),
            ...mapState('play', ['info']),
            ...mapState('lyrics', {
                lyricShow: 'show'
            })
        },
        watch: {
            show() {
                this.strategy = 'cache'
            },
            lyricShow() {
                this.strategy = 'cache'
            },
            'info'(val, oldVal) {
                let indexNew, indexOld
                if (oldVal) {
                    for (let i in eventBus.playlist) {
                        const item = eventBus.playlist[i]
                        if (item.songId === val.songId && item.vendor === val.vendor) {
                            indexNew = i
                        }
                        if (item.songId === oldVal.songId && item.vendor === oldVal.vendor) {
                            indexOld = i
                        }
                        if (indexNew && indexOld) break
                    }
                    if(indexOld && indexOld) {
                        playlistRenderCache[indexOld] = this.renderSingle(eventBus.playlist[indexOld])
                        playlistRenderCache[indexNew] = this.renderSingle(eventBus.playlist[indexNew])
                        if (this.strategy === 'cache') {
                            // 由于已经是渲染cache列表 所以 $forceUpdate 也会很快
                            this.$forceUpdate()
                        } else {
                            this.strategy = 'cache'
                        }
                    }
                }
            }
        },
        methods: {
            ...mapActions('play', ['play']),
            closeModal(e) {
                if (this.show) {
                    this.$store.commit('c_playlist/toggle')
                }
            },
            renderSingle(item) {
                return (
                    <div class={{
                        [this.s.item]: true,
                        [this.s.active]: this.info.songId === item.songId && this.info.vendor === item.vendor
                    }}
                         onClick={() => this.play({info: item})}
                    >
                        <div class={this.s.album_wrap}>
                            <img class={this.s.album}
                                 src={Vue.filter('image')(item.album.cover, item.vendor, 70)}/>
                        </div>
                        <div class={this.s.main}>
                            <span class={this.s.name}>{item.name}</span>
                            <span class={this.s.singer}>
                                {
                                    item.artists.map(item => item.name).join(' ')
                                }
                            </span>
                            {
                                this.info.songId === item.songId && this.info.vendor === item.vendor ? (
                                    <div class={this.s.volumeAnimation}>
                                        <div class={this.s.line1}></div>
                                        <div class={this.s.line2}></div>
                                        <div class={this.s.line3}></div>
                                        <div class={this.s.line4}></div>
                                    </div>
                                ) : null
                            }
                        </div>
                    </div>
                )
            },
            renderList() {
                console.time("renderList 耗时")
                playlistCache = []
                playlistRenderCache = eventBus.playlist.map(item => {
                    playlistCache.push({
                        songId: item.songId,
                        vendor: item.vendor
                    })
                    return this.renderSingle(item)
                })
                const rs = (
                    playlistRenderCache
                )
                console.timeEnd("renderList 耗时")
                return rs
            },
            renderCacheList(h) {
                console.time("renderCacheList 耗时")
                const rs = (
                    playlistRenderCache
                )
                console.timeEnd("renderCacheList 耗时")
                return rs
            }
        },
        render() {
            return (
                <transition enterClass={this.s.slideLeft_enter}
                            enterActiveClass={this.s.slideLeft_enter_active}
                            leaveToClass={this.s.slideLeft_leave_to}
                            leaveActiveClass={this.s.slideLeft_leave_active}
                >
                    <div v-show={this.show}
                         class={{[this.s.app]: true, [this.s.lyricShow]: this.lyricShow}}
                         v-clickoutside={this.closeModal}
                    >
                        {this.strategy === 'complete' ? this.renderList() : this.renderCacheList()}
                    </div>
                </transition>
            )
        },
        created() {
            eventBus.on('update', (val) => {
                const equal = _.isEqualWith(playlistCache, val, (a, b) => {
                    for (let i in b) {
                        if (!a[i] || a[i].songId !== b[i].songId || a[i].vendor !== b[i].vendor) return false
                    }
                    return true
                })
                const newStrategy = equal ? 'cache' : 'complete'
                if(newStrategy === this.strategy && newStrategy === 'complete') {
                    this.$forceUpdate()
                }
                this.strategy = newStrategy
            })
        }
    }
</script>
<style lang="scss" module="s">
    .slideLeft_enter_active, .slideLeft_leave_active {
        transform: translate3d(0, 0, 0);
        transition: all .4s;
    }

    .slideLeft_enter, .slideLeft_leave_to {
        transform: translate3d(100%, 0, 0);
        transition: all .4s;
    }

    .app {
        $width: 300px;
        position: fixed;
        right: 0;
        top: 0;
        width: 300px;
        height: calc(100% - 60px);
        background-color: white;
        box-shadow: 0 0 6px #ececec;
        overflow-y: auto;
        overflow-x: hidden;
        z-index: 6;
        &.lyricShow {
            box-shadow: none;
        }
    }

    .item {
        display: flex;
        width: 100%;
        padding: 10px 16px;
        transition: background-color .2s;
        cursor: pointer;
        .album_wrap {
            width: 35px;
            height: 35px;
            transition: all .2s;
            .album {
                width: 100%;
                height: 100%;
            }
        }
        .main {
            color: #555;
            display: inline-flex;
            flex-direction: column;
            justify-content: center;
            margin-left: 12px;
            position: relative;
            flex: 1;
            & > * {
                display: flex;
            }
            .name {
                font-size: 12px;
                max-width: 150px;
                @include text-ellipsis;
                display: inline-block;
            }
            .singer {
                font-size: 12px;
                max-width: 150px;
                @include text-ellipsis;
                display: inline-block;
            }
            .volumeAnimation {
                position: absolute;
                right: 14px;
                top: 0;
                bottom: 0;
                margin: auto;
                display: flex;
                align-items: flex-end;
                height: 16px;
                & > div {
                    width: 3px;
                    background-color: $color-primary;
                    margin-right: 1px;
                    &.line1 {
                        animation: line 0.6s infinite ease-in-out alternate;
                    }
                    &.line2 {
                        animation: line 0.6s 0.2s infinite ease-in-out alternate;
                    }
                    &.line3 {
                        animation: line 0.6s 0.4s infinite ease-in-out alternate;
                    }
                    &.line4 {
                        animation: line 0.6s 0.6s infinite ease-in-out alternate;
                    }
                    @keyframes line {
                        from {
                            height: 0;
                        }

                        to {
                            height: 16px;
                        }
                    }
                }
            }
        }
        &:hover {
            background-color: rgba(38, 179, 108, 0.5);
            transition: background-color .2s;
            * {
                color: white;
            }
        }
        &.active {
            .album_wrap {
                transition: all .2s;
                width: 50px;
                height: 50px;
            }
            .name {
                font-size: 14px;
            }
            .singer {
                font-size: 13px;
            }
        }
    }
</style>