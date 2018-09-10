<template>
    <div :class="s.titleBar">
        {{title}}
    </div>
</template>
<script>
    export default {
        props: {
            title: {
                type: String,
                required: true
            }
        }
    }
</script>
<style lang="scss" module="s">
    .titleBar {
        padding-bottom: 10px;
        color: $color-content;
        border-bottom: 1px solid $color-border1;
        font-size: 14px;
        position: relative;
        padding-left: 12px;
        &::after {
            content: ' ';
            background: $color-primary;
            width: 2px;
            height: calc(100% - 10px);
            position: absolute;
            left: 0;
            top: 0;
        }
    }
</style>