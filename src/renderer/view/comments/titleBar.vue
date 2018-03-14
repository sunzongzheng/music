<template>
    <div :class="s.titleBar">{{title}}</div>
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
        color: $color-sub;
        border-bottom: 1px solid $color-border1;
        font-size: 14px;
    }
</style>