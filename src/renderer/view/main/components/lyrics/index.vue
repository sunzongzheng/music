<template>
    <div :class="{[s.app]:true}">
        <div :class="s.wrap"></div>
        <div :class="s.cover" :style="style"></div>
        <div :class="s.control">
            <div :class="s.inner" v-if="status!=='fullscreen'">
                <Icon type="bottom" :class="s.close" @click.native="close"></Icon>
                <Icon type="fullscreen" :class="s.fullscreen" @click.native="op('fullscreen')"></Icon>
                <Icon type="narrow" :class="s.narrow" @click.native="op('minimize')"></Icon>
            </div>
            <!-- 全屏状态只有离开全屏 !-->
            <Icon type="fullscreenexit" :class="s.fullscreen" @click.native="op('leaveFullscreen')" v-else></Icon>
        </div>
        <ul :class="s.main" ref="main" @wheel="scrollBarWheel" v-if="lyrics.length" :style="mainStyle">
            <li v-for="(item,index) in lyrics" :class="{[s.item]:true,[s.active]:activeIndex === index}">
                {{item[1]}}
            </li>
        </ul>
        <div :class="s.main" :style="mainStyle" v-else>
            <span :class="[s.item,s.nolyric,s.active]">{{placeholder}}</span>
        </div>
        <span :class="s.commentIcon" @click="go2Comments">评</span>
        <!--<transition :enter-class="s.slideLeft_enter"-->
                    <!--:enter-active-class="s.slideLeft_enter_active"-->
                    <!--:leave-to-class="s.slideLeft_leave_to"-->
                    <!--:leave-active-class="s.slideLeft_leave_active"-->
        <!--&gt;-->
            <!--<song-comment :class="s.comment" v-show="showComment" @close="showComment = false"></song-comment>-->
        <!--</transition>-->
    </div>
</template>
<script src="./index.js"></script>
<style lang="scss" module="s">
    .app {
        position: fixed;
        z-index: 5;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding-bottom: 60px;
        will-change: transform;
        transition: all .4s;
        .wrap,
        .cover,
        .main {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
        }
        .wrap {
            z-index: 4;
            background-color: black;
        }
        .cover {
            z-index: 5;
            background-repeat: no-repeat;
            background-position: center;
            background-size: cover;
            filter: blur(35px);
            opacity: .3;
        }
        .main {
            z-index: 6;
            text-align: center;
            color: rgba(255, 255, 255, 0.9);
            overflow: auto;
            height: calc(100% - 60px);
            width: 60%;
            transition: all .4s;
            .item {
                padding: 8px 0;
                &.active {
                    color: $color-primary;
                }
            }
            .nolyric {
                display: inline-flex;
                margin-top: 20px;
            }
            &::-webkit-scrollbar {
                display: none;
            }
        }
        .comment {
            position: fixed;
            z-index: 8;
            width: 40%;
            height: calc(100% - 60px);
            background-color: rgba(255, 255, 255, 0.1);
            right: 0;
            top: 0;
            transition: all .4s;
        }
        .control {
            position: absolute;
            left: 16px;
            top: 12px;
            background-color: transparent;
            z-index: 7;
            width: 200px;
            height: 50px;
            -webkit-app-region: no-drag;
            .inner {
                display: flex;
            }
            svg {
                font-size: 24px;
                margin-right: 8px;
                color: #B7B7B7;
                &:hover {
                    color: #f2f2f2;
                }
            }
        }
        .commentIcon {
            position: absolute;
            right: 75px;
            bottom: 75px;
            z-index: 7;
            background-color: rgba(255, 255, 255, 0.4);
            border-radius: 4px;
            width: 24px;
            height: 24px;
            text-align: center;
            cursor: pointer;
            color: #b9b9b9;
            &:hover {
                opacity: .65;
            }
        }
        .slideLeft_enter_active, .slideLeft_leave_active {
            transform: translate3d(0, 0, 0);
        }

        .slideLeft_enter, .slideLeft_leave_to {
            transform: translate3d(100%, 0, 0);
        }
    }
</style>