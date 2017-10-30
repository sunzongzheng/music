<template>
    <div :class="s.info">
        <!-- 专辑头像 !-->
        <img :src="play.info | defaultAlbum" :class="s.album" @click="toggleLyrics"/>
        <!-- 歌曲信息 !-->
        <div :class="s.inner">
            <div :class="s.song">
                <template v-if="play.url">
                    <span :class="s.name">{{play.info.name}}</span>
                    <span>-</span>
                    <span>{{play.info.artists[0].name}}</span>
                </template>
                <template v-else>听你想听的音乐</template>
                <!-- 时间 !-->
                <span :class="s.duration">
                    {{duration.cur | minute}}&nbsp;/&nbsp;{{duration.total | minute}}
                </span>
            </div>
            <!-- 歌曲进度 !-->
            <el-progress :percentage="percentage" :stroke-width="2" :class="s.progress"></el-progress>
        </div>
        <!-- 歌曲操作 !-->
        <template v-if="info">
            <add-to-playlist icon="add" v-if="play.info" :class="s.icon" :info="play.info"></add-to-playlist>
            <Icon type="add" :class="s.icon" v-else :disabled="true"></Icon>
        </template>
        <Icon v-else type="add" :class="s.icon" @click.native="$ipc.send('login')"></Icon>
        <!-- 下载 !-->
        <Icon type="download" :class="s.icon" :disabled="true"></Icon>
        <!-- 打开列表 !-->
        <Icon type="musiclist" :class="s.icon" style="margin-top: 2px;" :disabled="!playlist.length"
              @click.native="playlist.length?$emit('showPlaylist'):''"></Icon>
        <audio :src="play.url" ref="audio" autoplay></audio>
    </div>
</template>
<script src="./index.js"></script>
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
        .album {
            width: 35px;
        }
        .inner {
            display: flex;
            flex-direction: column;
            width: 80%;
            font-size: 12px;
            color: gray;
            margin-left: 10px;
            margin-right: 20px;
            .song {
                position: relative;
                .name {
                    color: #333;
                    font-size: 13px;
                }
                .duration {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                }
            }
            .progress {
                :global {
                    .el-progress-bar {
                        padding-right: 0;
                    }
                    .el-progress-bar__inner {
                        background-color: #3AC17E;
                    }
                    .el-progress__text {
                        display: none;
                    }
                }
            }
        }
        .icon {
            color: #555;
            margin-right: 10px;
            cursor: pointer;
        }
    }
</style>