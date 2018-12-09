<template>
    <div :class="s.player" id="player">
        <m-progress></m-progress>
        <left></left> <control></control> <right></right>
    </div>
</template>
<script>
import left from './components/left.vue'
import right from './components/right.vue'
import control from './components/control.vue'
import mProgress from './components/progress.vue'

export default {
    components: {
        left,
        right,
        control,
        mProgress,
    },
}
</script>
<style lang="scss" module="s">
.player {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: $player-height;
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #eef2f3 0%, #f9f9f9 100%);
}
</style>
