<template>
    <div :class="s.right">
        <div :class="s.volume">
            <Icon
                :type="_volume ? 'volume' : 'volume_mute'"
                :class="s.icon"
                clickable
                @click="toggleVolume"
            ></Icon>
            <el-slider
                v-model="_volume"
                :class="s.slider"
                :show-tooltip="false"
            ></el-slider>
        </div>
        <Icon
            type="musiclist"
            :class="s.icon"
            clickable
            @click="toggleShowPlaylist"
        ></Icon>
    </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
    data() {
        return {
            restoreVolume: 0,
        }
    },
    computed: {
        ...mapState('audio', ['volume']),
        _volume: {
            get() {
                return this.volume
            },
            set(val) {
                this.updateVolume(val)
            },
        },
    },
    methods: {
        ...mapMutations('audio', ['updateVolume']),
        ...mapActions('playing', ['toggleShowPlaylist']),
        toggleVolume() {
            if (this._volume === 0 && this.restoreVolume === 0) {
                this.restoreVolume = 20
            }
            const t = this._volume
            this._volume = this.restoreVolume
            this.restoreVolume = t
        },
    },
}
</script>
<style lang="scss" module="s">
.right {
    position: absolute;
    right: 24px;
    top: 0;
    bottom: 0;
    margin: auto;
    display: flex;
    align-items: center;
    .volume {
        display: flex;
        align-items: center;
        .slider {
            width: 80px;
            margin-left: 4px;
            :global {
                .el-slider__runway {
                    margin: 6px 0;
                    height: 4px;
                    user-select: none;
                    border-radius: 2px;
                    .el-slider__bar {
                        height: 4px;
                        border-radius: 2px;
                    }
                    .el-slider__button-wrapper {
                        height: 32px;
                        width: 32px;
                        outline: none;
                        top: -14px;
                    }
                    .el-slider__button {
                        display: none;
                        width: 8px;
                        height: 8px;
                        border: 2px solid $color-primary;
                        background-color: $color-primary;
                        outline: none;
                    }
                    &:hover {
                        .el-slider__button {
                            display: inline-block;
                        }
                    }
                }
            }
        }
    }
    .icon {
        font-size: 24px;
        margin-left: 16px;
    }
}
</style>
