<template>
    <p :class="s.title">{{ title }}</p>
</template>
<script>
export default {
    props: {
        title: String,
    },
}
</script>
<style lang="scss" module="s">
.title {
    font-weight: bold;
    font-size: 14px;
    color: $color-disabled;
    margin-top: 12px;
    flex-shrink: 0;
    height: 32px;
    line-height: 32px;
}
</style>
