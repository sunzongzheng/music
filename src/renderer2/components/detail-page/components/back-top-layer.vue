<template>
    <transition name="el-zoom-in-bottom">
        <Icon
            type="back-top"
            :class="s.backTopLayer"
            clickable
            @click="backTop"
            v-if="fixed"
        ></Icon>
    </transition>
</template>
<script>
export default {
    props: {
        fixed: Boolean,
    },
    methods: {
        backTop() {
            this.$parent.$el.scrollTop = 0
        },
    },
}
</script>
<style lang="scss" module="s">
.backTopLayer {
    position: fixed;
    right: 24px;
    bottom: $player-height + 48px;
    z-index: 99;
    font-size: 24px;
    color: $color-disabled;
}
</style>
