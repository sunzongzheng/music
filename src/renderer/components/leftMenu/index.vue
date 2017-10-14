<template>
    <div :class="s.app">
        <view-control></view-control>
        <v-avatar></v-avatar>
    </div>
</template>
<script>
  import viewControl from './viewControl.vue'
  import vAvatar from './avatar.vue'

  export default {
    components: {vAvatar, viewControl}
  }
</script>
<style lang="scss" module="s">
    .app {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
        background: linear-gradient(to bottom, #f6f6f6, #f2f2f2);
        -webkit-app-region: drag;
    }
</style>