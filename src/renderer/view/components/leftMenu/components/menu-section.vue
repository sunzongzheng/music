<template>
    <div :class="s.menuSection">
        <div :class="s.top">
            <span :class="s.title">{{title}}</span>
            <slot name="append"></slot>
        </div>
        <ul :class="s.list">
            <slot></slot>
        </ul>
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
    .menuSection {
        margin-bottom: 16px;
        .top {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            .title {
                font-size: 12px;
                color: #8F8F8F;
            }
        }
    }
</style>