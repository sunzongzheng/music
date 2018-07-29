<template>
    <div :class="s.desktopLyric">
        <i class="el-icon-close" :class="s.closeIcon" @click="closeLyric"></i>
        <lyric-item :lyric="lyric" :class="s.base"></lyric-item>
        <!--<lyric-item :lyric="lyric" :class="s.cover" color="red" :style="style" v-if="cover"></lyric-item>-->
    </div>
</template>
<script>
    import {ipcRenderer, remote} from 'electron'
    import lyricItem from './lyric-item.vue'

    export default {
        components: {
            lyricItem
        },
        data() {
            return {
                lyric: '听你想听的音乐',
                time: 0,
                width: 0,
                cover: false,
            }
        },
        computed: {
            // style() {
            //     return {
            //         '-webkit-transition': `${this.time / 1000}s 0s linear`,
            //         width: this.width
            //     }
            // }
        },
        methods: {
            closeLyric() {
                ipcRenderer.send('backgroundWindowStatusChange', false)
            }
        },
        created() {
            ipcRenderer.on('tray-control-lyrics', (event, {text, time}) => {
                console.log(text, time)
                this.time = 0
                this.width = 0
                this.lyric = text
                // setTimeout(() => {
                //     this.time = time
                //     this.width = '100%'
                // }, 100)
            })
        }
    }
</script>
<style lang="scss" module="s">
    .desktopLyric {
        width: 100%;
        height: 100%;
        position: relative;
        background: rgba(128, 128, 128, 0.8);
        border-radius: 4px;
        .cover {
            position: absolute;
            left: 0;
            top: 0;
            z-index: 1;
        }
        .closeIcon {
            position: absolute;
            left: 8px;
            top: 8px;
            color: white;
            z-index: 2;
            -webkit-app-region: no-drag;
            cursor: pointer;
            display: flex;
        }
        &:hover {
            .closeIcon {
                display: block;
            }
        }
    }
</style>