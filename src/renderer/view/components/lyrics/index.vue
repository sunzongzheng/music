<template>
    <transition :enter-class="s.slideTop_enter"
                :enter-active-class="s.slideTop_enter_active"
                :leave-to-class="s.slideTop_leave_to"
                :leave-active-class="s.slideTop_leave_active"
    >
        <div :class="{[s.app]:true}"
             v-show="show"
        >
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
                    <p v-html="item[1]"></p>
                    <template v-if="showTranslate && translate[index] && translate[index][1]">
                        <p v-html="translate[index][1]"></p>
                    </template>
                </li>
            </ul>
            <div :class="s.main"
                 :style="mainStyle"
                 v-loading="loading"
                 element-loading-background="rgba(0, 0, 0, 0)"
                 v-else
            >
                <span :class="[s.item,s.nolyric,s.active]">{{placeholder}}</span>
                <p :class="s.reloadLyric"
                   @click="init"
                >点此尝试重新加载</p>
            </div>
            <div :class="s.float">
                <div :class="{ [s.icon]:true, [s.showTranslate]: showTranslate }"
                     v-if="hasTranslation"
                     @click="toggleTranslate"
                >
                    译
                </div>
                <div :class="s.icon" @click="go2Comments">评</div>
            </div>
        </div>
    </transition>
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
            -webkit-mask: -webkit-linear-gradient(top, rgba(0, 0, 0, 0), #fff 25%, #fff 75%, rgba(0, 0, 0, 0));
            .item {
                margin: 22px 0;
                min-height: 18px;
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
            .reloadLyric {
                cursor: pointer;
                transition: opacity .2s;
                &:hover {
                    transition: opacity .2s;
                    opacity: .8;
                }
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
        .float {
            position: absolute;
            right: 75px;
            bottom: 75px;
            z-index: 7;
            display: flex;
            .icon {
                background-color: rgba(255, 255, 255, 0.4);
                border-radius: 4px;
                width: 24px;
                height: 24px;
                line-height: 24px;
                text-align: center;
                cursor: pointer;
                color: #b9b9b9;
                margin-left: 12px;
                &:hover {
                    opacity: .65;
                }
                &.showTranslate {
                    color: $color-primary;
                    background-color: rgba(255, 255, 255, 0.2);
                }
            }
        }
        .slideLeft_enter_active, .slideLeft_leave_active {
            transform: translate3d(0, 0, 0);
        }

        .slideLeft_enter, .slideLeft_leave_to {
            transform: translate3d(100%, 0, 0);
        }
    }

    .slideTop_enter_active, .slideTop_leave_active {
        transform: translate3d(0, 0, 0);
    }

    .slideTop_enter, .slideTop_leave_to {
        transform: translate3d(0, 100%, 0);
    }
</style>