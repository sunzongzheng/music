<template>
    <div :class="s.shareItem">
        <img :src="song.album.cover"/>
        <div :class="s.main">
            <p>{{song.name}}</p>
            <p :class="s.artists">
                <a v-for="item in song.artists"
                   @click="goArtistDetail(item.id)"
                >
                    {{item.name}}
                </a>
            </p>
            <Icon type="play" :class="s.play" @click="doPlay"></Icon>
        </div>
    </div>
</template>
<script>
    import {mapActions} from 'vuex'

    export default {
        props: {
            message: {
                type: String,
                required: true
            }
        },
        computed: {
            song() {
                return JSON.parse(this.message)
            }
        },
        methods: {
            ...mapActions('play', ['play']),
            goArtistDetail(id) {
                if (this.song.vendor === 'baidu') {
                    this.$message.warning('PC端暂未支持百度音乐')
                    return
                }
                this.$router.push({
                    name: 'artist.detail',
                    params: {
                        id
                    },
                    query: {
                        vendor: this.song.vendor
                    }
                })
            },
            doPlay() {
                if (this.song.vendor === 'baidu') {
                    this.$message.warning('PC端暂未支持百度音乐')
                    return
                }
                this.play({
                    info: this.song
                })
            }
        }
    }
</script>
<style lang="scss" module="s">
    .shareItem {
        display: flex;
        img {
            @include size(48px);
        }
        .main {
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: space-between;
            font-size: 14px;
            padding: 4px 0 4px 8px;
            position: relative;
            p {
                line-height: 1;
            }
            .artists {
                font-size: 12px;
                a {
                    color: $color-content;
                    &:hover {
                        color: $color-primary;
                    }
                }
            }
            .play {
                position: absolute;
                right: 8px;
                top: 0;
                bottom: 0;
                margin: auto;
                font-size: 28px;
                color: $color-primary;
                cursor: pointer;
                &:hover {
                    opacity: .8;
                }
            }
        }
    }
</style>