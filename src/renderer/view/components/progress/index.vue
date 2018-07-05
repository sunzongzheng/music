<template>
    <div v-if="progress >= 0"
         :class="s.progress"
         title="下载进度"
    >
        {{progress}}%
    </div>
</template>
<script>
    export default {
        data() {
            return {
                progress: -1
            }
        },
        created() {
            // 更新下载进度悬浮窗
            this.$updater.on('download-progress', progress => {
                this.progress = progress
                if (this.progress === 100) {
                    this.progress = -1
                }
            })
        }
    }
</script>
<style lang="scss" module="s">
    .progress {
        position: absolute;
        width: 35px;
        height: 35px;
        right: 20px;
        top: 20px;
        z-index: 1;
        background: rgba(38, 179, 108, .6);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
    }
</style>