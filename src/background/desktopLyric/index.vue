<template>
    <div :class="s.desktopLyric">
        <div :class="s.control">
            <i class="el-icon-close" :class="s.closeIcon" @click="closeLyric"></i>
            <Icon type="move"
                  :class="s.moveIcon"
            ></Icon>
        </div>
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
                drag: {
                    x: 0,
                    y: 0,
                    status: false
                }
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
        display: flex;
        align-items: center;
        justify-content: center;
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
        .control {
            display: none;
            align-items: center;
            justify-content: center;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 2;
            padding-top: 8px;
            .closeIcon,
            .moveIcon {
                color: white;
                cursor: pointer;
                margin-left: 8px;
            }
            .moveIcon {
                -webkit-app-region: drag;
            }
        }
        &:hover {
            .control {
                display: flex;
            }
        }
    }
</style>