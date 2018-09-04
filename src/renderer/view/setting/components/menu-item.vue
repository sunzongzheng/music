<template>
    <div :class="s.menuItem">
        <p :class="s.title">{{title}}</p>
        <slot :class="s.main"></slot>
    </div>
</template>
<script>
    export default {
        props: {
            title: String
        }
    }
</script>
<style lang="scss" module="s">
    .menuItem {
        display: flex;
        align-items: flex-start;
        width: 100%;
        padding: 24px 0;
        border-bottom: 1px solid $color-border4;

        .title {
            width: 150px;
            flex-shrink: 0;
        }
        .main {
            flex: 1;
        }
    }
</style>