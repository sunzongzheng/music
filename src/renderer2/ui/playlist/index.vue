<template>
    <div
        :class="playlistClasses"
        :style="playlistStyle"
        v-clickoutside.player="clickoutside"
    >
        <div :class="s.info">
            <p :class="s.title">播放列表</p>
            <div :class="s.bottom">
                <span :class="s.sub">共{{ list.length }}首歌曲</span>
                <a
                    @click="addToPlaylist"
                    :class="s.addToPlaylist"
                    v-if="logged"
                >
                    <i class="el-icon-plus"></i> 添加到歌单
                </a>
            </div>
        </div>
        <div :class="s.songs" ref="songs">
            <div
                v-for="(item, index) in list"
                :key="index"
                @contextmenu="showContextMenu(item, index)"
                :class="itemClasses(index)"
                @click="play(index)"
            >
                <div :class="s.album_wrap">
                    <img :class="s.album" :src="item.album.cover | image(70)" />
                </div>
                <div :class="s.main">
                    <span :class="s.name">{{ item.name }}</span>
                    <span :class="s.singer">
                        {{ item.artists.map(item => item.name).join(' ') }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'

export default {
    data() {
        return {
            lyricShow: false,
        }
    },
    computed: {
        ...mapState('playing', {
            list: 'list',
            showPlaylist: 'showPlaylist',
            activeIndex: 'index',
        }),
        ...mapGetters('user', ['logged']),
        playlistClasses() {
            return {
                [this.s.playlist]: true,
                [this.s.lyricShow]: this.lyricShow,
            }
        },
        playlistStyle() {
            return {
                transform: `translate3d(${
                    this.showPlaylist ? 0 : '100%'
                }, 0, 0)`,
            }
        },
    },
    watch: {
        showPlaylist(val) {
            if (val) {
                this.$refs.songs.scrollTop = this.activeIndex * 55
            }
        },
        list(val) {
            console.log(val)
        }
    },
    methods: {
        ...mapMutations('playing', ['setShowPlaylist']),
        ...mapActions('audio', ['play']),
        itemClasses(index) {
            return {
                [this.s.item]: true,
                [this.s.active]: index === this.activeIndex,
            }
        },
        clickoutside() {
            this.showPlaylist && this.setShowPlaylist(false)
        },
        addToPlaylist() {},
        showContextMenu() {},
    },
}
</script>
<style lang="scss" module="s">
.playlist {
    $width: 300px;
    position: fixed;
    right: 0;
    top: 0;
    width: 300px;
    height: calc(100% - #{$player-height});
    background-color: white;
    box-shadow: 0 0 6px #ececec;
    z-index: 9999;
    -webkit-app-region: no-drag;
    transition: all 0.4s;
    will-change: transform;
    backface-visibility: hidden;
    &.lyricShow {
        box-shadow: none;
    }
    .info {
        padding: 14px;
        background: #fdfdfd;
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
                cursor: pointer;
                color: $color-content;
                &:hover {
                    color: $color-primary;
                }
            }
        }
    }
    .songs {
        height: calc(100% - 84px);
        overflow-y: auto;
        overflow-x: hidden;
        .item {
            display: flex;
            width: 100%;
            padding: 10px 16px;
            cursor: pointer;
            position: relative;
            .album_wrap {
                width: 35px;
                height: 35px;
                transition: all 0.2s;
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
            }
            &:hover {
                background: linear-gradient(to right, white 32px, color-primary(0.5));
            }
            &.active {
                &::before {
                    content: ' ';
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 2px;
                    height: 100%;
                    background: $color-primary;
                }
            }
        }
    }
}
</style>
