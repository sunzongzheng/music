<template>
    <svg :class="s.icon" aria-hidden="true" @click="$emit('click')">
        <use :xlink:href="`#icon-${type}`"></use>
    </svg>
</template>
<script>
  export default {
    props: {
      type: {
        type: String,
        required: true
      }
    }
  }
</script>
<style lang="scss" module="s">
    .icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }
</style>