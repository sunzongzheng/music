<script type="text/jsx">
    import Vue from 'vue'
    import {mapState} from 'vuex'

    export default {
        computed: {
            ...mapState('play', ['info']),
            ...mapState('lyrics', ['show']),
        },
        methods: {
            toggleLyrics() {
                // 本地歌曲 不允许打开
                if (this.info.fullpath) return
                this.$store.commit('lyrics/update', {
                    show: !this.show
                })
            },
        },
        render(h) {
            return (
                <div class={{
                    [this.s.album]: true,
                    [this.s.playing]: this.info && !this.info.fullpath,
                    [this.s.lyric]: this.show,
                }}>
                    <img src={Vue.filter('defaultAlbum')(this.info)}/>
                    <div class={this.s.cover} onClick={this.toggleLyrics}>
                        <icon type="shuangjiantou"></icon>
                    </div>
                </div>
            )
        }
    }
</script>
<style lang="scss" module="s">
    .album {
        width: 35px;
        position: relative;
        display: flex;
        img {
            width: 35px;
            height: 35px;
        }
        .cover {
            display: none;
        }
        &.playing {
            &:hover {
                .cover {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 35px;
                    background-color: #4e4e4e;
                    opacity: .5;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    cursor: pointer;
                }
            }
        }
        &.lyric {
            .cover {
                transform: rotate(180deg);
            }
        }
    }
</style>