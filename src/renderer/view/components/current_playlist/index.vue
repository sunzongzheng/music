<template>
    <transition :enterClass="s.slideLeft_enter"
                :enterActiveClass="s.slideLeft_enter_active"
                :leaveToClass="s.slideLeft_leave_to"
                :leaveActiveClass="s.slideLeft_leave_active"
    >
        <div v-show="show"
             :class="{[s.current_playlist]: true, [s.lyricShow]: lyricShow}"
             v-clickoutside="closeModal"
        >
            <div :class="s.info">
                <p :class="s.title">播放列表</p>
                <div :class="s.bottom">
                    <span :class="s.sub">共{{playlist.length}}首歌曲</span>
                    <a @click="addToPlaylist" :class="s.addToPlaylist" v-if="userInfo">
                        <i class="el-icon-plus"></i>
                        添加到歌单
                    </a>
                </div>
            </div>
            <div :class="s.songs">
                <div v-for="(item,index) in playlist"
                     :key="`${item.songId}${item.vendor}`"
                     @contextmenu="showContextMenu(item, index)"
                     :class="{
                 [s.item]: true,
                 [s.active]: info.songId === item.songId && info.vendor === item.vendor
                 }"
                     @click="play({info: item})"
                >
                    <div :class="s.album_wrap">
                        <img :class="s.album"
                             :src="item.album.cover | image(item.vendor, 70)"/>
                    </div>
                    <div :class="s.main">
                        <span :class="s.name">{{item.name}}</span>
                        <span :class="s.singer">
                        {{item.artists.map(item => item.name).join(' ')}}
                    </span>
                        <div :class="s.volumeAnimation"
                             v-if="info.songId === item.songId && info.vendor === item.vendor">
                            <div :class="s.line1"></div>
                            <div :class="s.line2"></div>
                            <div :class="s.line3"></div>
                            <div :class="s.line4"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script type="text/jsx">
    import Clickoutside from 'element-ui/src/utils/clickoutside'
    import {mapState, mapActions} from 'vuex'

    export default {
        directives: {Clickoutside},
        data() {
            return {
                strategy: 'cache', // cache || complete || toggle
            }
        },
        computed: {
            ...mapState('c_playlist', ['show', 'playlist']),
            ...mapState('playlist', {
                allPlaylist: 'playlist'
            }),
            ...mapState('play', ['info']),
            ...mapState('user', {
                userInfo: 'info'
            }),
            ...mapState('lyrics', {
                lyricShow: 'show'
            })
        },
        methods: {
            ...mapActions('play', ['play']),
            ...mapActions('c_playlist', ['remove']),
            closeModal() {
                if (this.show) {
                    this.$store.commit('c_playlist/toggle')
                }
            },
            showContextMenu(item, index) {
                this.$contextMenu.song(
                    {
                        ...item,
                        id: item.songId
                    },
                    this.playlist,
                    [
                        {
                            label: '从列表删除',
                            click: () => {
                                this.remove(index)
                            }
                        }
                    ]
                )
            },
            // 添加到歌单
            addToPlaylist() {
                this.$ipc.send('add-to-playlist', {
                    songs: this.playlist,
                    playlist: this.allPlaylist
                })
            }
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

    .current_playlist {
        $width: 300px;
        position: fixed;
        right: 0;
        top: 0;
        width: 300px;
        height: calc(100% - 60px);
        background-color: white;
        box-shadow: 0 0 6px #ececec;
        z-index: 9999;
        -webkit-app-region: no-drag;
        &.lyricShow {
            box-shadow: none;
        }
        .info {
            padding: 14px;
            background: #FDFDFD;
            .title {
                font-size: 21px;
            }
            .bottom {
                margin-top: 2px;
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                .sub {
                    color: $color-content;
                }
                .addToPlaylist {
                    color: $color-content;
                    &:hover {
                        color: $color-primary;
                    }
                }
            }
        }
        .songs {
            height: calc(100% - 80px);
            overflow-y: auto;
            overflow-x: hidden;
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
        }
    }
</style>