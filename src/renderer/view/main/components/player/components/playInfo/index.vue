<template>
    <div :class="{[s.info]:true,[s.lyric]:show}">
        <!-- 专辑头像 !-->
        <div :class="{[s.album]:true,[s.playing]:play.info}">
            <img :src="play.info | defaultAlbum"/>
            <div :class="s.cover" @click="toggleLyrics">
                <Icon type="shuangjiantou"></Icon>
            </div>
        </div>
        <!-- 歌曲信息 !-->
        <div :class="s.inner">
            <div :class="s.song">
                <template v-if="play.url">
                    <span :class="s.name">{{play.info.name}}</span>
                    <span>-</span>
                    <span :class="s.singer">
                        <template v-for="item in play.info.artists">
                            {{item.name}}
                        </template>
                    </span>
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
        <add-to-playlist icon="add" v-if="play.info" :class="s.icon" :info="play.info"></add-to-playlist>
        <Icon type="add" :class="s.icon" v-else :disabled="true"></Icon>
        <!-- 分享 !-->
        <Icon type="share" :class="s.icon" @click="showShareWindow" :disabled="!play.info"></Icon>
        <!-- 打开列表 !-->
        <Icon type="musiclist" :class="s.icon" style="margin-top: 2px;" :disabled="!playlist.length"
              @click.native="toggleList"></Icon>
        <audio :src="play.url"
               ref="audio"
               preload="true"
               @timeupdate="timeupdate"
               @ended="$store.dispatch('c_playlist/next')"
               @error="$store.dispatch('c_playlist/next')"
        ></audio>
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
        &.lyric {
            background: transparent;
            border: none;
            .inner,
            .inner > .song > .name,
            .icon {
                color: white;
            }
            .cover {
                transform: rotate(180deg);
            }
        }
        .album {
            width: 35px;
            position: relative;
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
        }
        .inner {
            display: flex;
            flex-direction: column;
            width: calc(100% - 35px - 108px);
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
                .singer {
                    display: inline-block;
                    max-width: 300px;
                    vertical-align: top;
                    @include text-ellipsis;
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