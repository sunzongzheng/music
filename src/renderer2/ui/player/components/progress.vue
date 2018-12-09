<template>
    <div
        :class="s.progress"
        ref="progress"
        :style="progressStyle"
        @mouseenter="mouseenter = true"
        @mouseleave="mouseenter = false"
        @click="trackClick"
    >
        <transition name="el-zoom-in-bottom">
            <div
                :class="s.time"
                :style="timeStyle"
                v-if="show"
                ref="time"
                @mousedown="mousedown"
            >
                {{
                    (dragging ? draggingCurrentTime : currentTime) | minute
                }}&nbsp;/&nbsp;{{ duration | minute }}
            </div>
        </transition>
    </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import dayjs from 'dayjs'

export default {
    data() {
        return {
            totalWidth: 0,
            currentTime: 0,
            mouseenter: false,
            dragging: false,
            draggingCurrentTime: 0,
            startPosition: 0,
        }
    },
    computed: {
        ...mapState('audio', ['audio', 'duration']),
        ...mapState('playing', ['index']),
        show() {
            return this.currentTime > 0
        },
        percentage() {
            return (this.currentTime * 100) / this.duration
        },
        offsetLeft() {
            return this.show ? (this.percentage * this.totalWidth) / 100 : 0
        },
        draggingOffsetLeft() {
            return (this.draggingCurrentTime * this.totalWidth) / this.duration
        },
        trackHeight() {
            return this.mouseenter || this.dragging ? '4px' : '2px'
        },
        timeStyle() {
            return {
                transform: `translateX(${
                    this.dragging ? this.draggingOffsetLeft : this.offsetLeft
                }px)`,
                bottom: this.trackHeight,
                transition: `all ${this.dragging ? 0 : 0.2}s linear`,
            }
        },
        progressStyle() {
            return {
                height: this.trackHeight,
                background: this.offsetLeft
                    ? `linear-gradient(
                        to right,
                        rgba(64, 158, 255, 0.6) 0,
                        rgba(64, 158, 255, 0.6) ${this.offsetLeft}px,
                        rgba(64, 158, 255, 0.1) ${this.offsetLeft +
                            (this.$refs.time
                                ? this.$refs.time.offsetWidth
                                : 0)}px,
                        rgba(64, 158, 255, 0.1) 100%
                    )`
                    : 'rgba(64, 158, 255, 0.1)',
            }
        },
    },
    watch: {
        show(val) {
            if (val) {
                this.$nextTick(() => {
                    this.totalWidth = this.$refs.progress.offsetWidth
                })
            }
        },
        index() {
            this.reset()
        },
    },
    filters: {
        minute(val) {
            return dayjs(val * 1000).format('mm:ss')
        },
    },
    methods: {
        trackClick(event) {
            // 只有点击轨道才算
            if (this.$refs.time.contains(event.target)) return
            this.audio.currentTime = this.currentTime =
                (event.clientX * this.duration) / this.totalWidth
        },
        mousedown(event) {
            this.startPosition =
                event.clientX - this.$refs.time.getBoundingClientRect().left // 计算按下的点距离滑块左侧距离
            this.mousemove(event)
            this.dragging = true
            window.addEventListener('mousemove', this.mousemove)
            window.addEventListener('mouseup', this.mouseup)
        },
        mousemove(event) {
            this.draggingCurrentTime =
                ((event.clientX - this.startPosition) * this.duration) /
                this.totalWidth
        },
        mouseup(event) {
            this.audio.currentTime = this.currentTime = this.draggingCurrentTime
            this.dragging = false
            window.removeEventListener('mousemove', this.mousemove)
            window.removeEventListener('mouseup', this.mouseup)
        },
        reset() {
            this.currentTime = this.draggingCurrentTime = 0
        },
    },
    mounted() {
        this.audio.addEventListener('timeupdate', async event => {
            this.currentTime = this.audio.currentTime
        })
        this.audio.addEventListener('loadstart', this.reset)
    },
}
</script>
<style lang="scss" module="s">
.progress {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    cursor: pointer;
    transition: all 0.2s linear;
    user-select: none;
    z-index: 1;
    .time {
        position: absolute;
        left: 0;
        height: 20px;
        line-height: 20px;
        padding: 0 4px;
        font-size: 12px;
        background: black;
        color: white;
        cursor: pointer;
        z-index: 2;
    }
}
</style>
