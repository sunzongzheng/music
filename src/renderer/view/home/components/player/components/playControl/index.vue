<template>
    <div :class="s.control">
        <!-- 播放控制 !-->
        <div :class="s.playControl">
            <!-- 上一曲 !-->
            <Icon type="last" @click.native="$store.dispatch('c_playlist/last')"></Icon>
            <!-- 播放/暂停 !-->
            <Icon :type="play.pause?'play':'plus-pause'" :class="s.play" @click.native="pauseChange"></Icon>
            <!-- 下一曲 !-->
            <Icon type="last" :class="s.next" @click.native="$store.dispatch('c_playlist/next')"></Icon>
        </div>
        <!-- 音量 !-->
        <el-popover ref="volume" placement="top" trigger="click" popper-class="volumeSlider">
            <el-slider v-model="volume" vertical height="50px" :min="0" :max="100"></el-slider>
        </el-popover>
        <Icon type="volume" :class="s.volume" v-popover:volume></Icon>
        <Icon :type="'cycle-' + cycle" :class="s.volume" @click.native="cycleChange"></Icon>
    </div>
</template>
<script src="./index.js"></script>
<style lang="scss" module="s">
    .control {
        display: flex;
        align-items: center;
        font-size: 28px;
        width: 200px;
        height: 100%;
        padding: 0 10px;
        justify-content: space-around;
        background-color: #EBEAEB;
        opacity: .6;
        user-select: none;
        & > span {
            display: none;
        }
        svg {
            cursor: pointer;
        }
        .playControl {
            color: #26B36C;
            .play {
                font-size: 32px;
            }
            .next {
                transform: rotate(180deg);
            }
        }
        .volume {
            font-size: 20px;
        }
    }
</style>
<style lang="scss">
    .volumeSlider {
        min-width: 0;
        padding: 12px 0;
        .el-slider__button,
        .el-slider__bar {
            background-color: #26B36C;
        }
        .el-slider__button {
            width: 10px;
            height: 10px;
            border: 2px solid #26B36C;
        }
        .el-slider.is-vertical .el-slider__button-wrapper {
            left: -16px;
        }
    }
</style>