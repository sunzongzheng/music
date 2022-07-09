<template>
    <span :class="{ [s.quality]: true, [s.sq]: sq }" v-if="show">
        {{ sq ? 'SQ' : 'HQ' }}
    </span>
</template>
<script>
export default {
    props: {
        maxbr: {
            type: Number
        },
    },
    computed: {
        show() {
            return this.maxbr > 128
        },
        sq() {
            return this.maxbr === 999
        },
    },
}
</script>
<style lang="scss" module="s">
.quality {
    color: $color-primary;
    border: 1px solid $color-primary;
    height: 14px;
    padding: 1px 2px;
    font-size: 10px;
    display: flex;
    align-items: center;
    &.sq {
        color: $color-warn;
        border-color: $color-warn;
    }
}
</style>
