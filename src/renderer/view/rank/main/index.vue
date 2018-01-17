<template>
    <div :class="s.app">
        <p>网易云音乐排行榜</p>
        <ul :class="s.main">
            <v-item v-for="(item,index) in list" :key="index" :id="index"></v-item>
        </ul>
    </div>
</template>
<script>
  import vItem from './item.vue'

  export default {
    components: {vItem},
    data() {
      return {
        list: new Array(21)
      }
    }
  }
</script>
<style lang="scss" module="s">
    .app {
        padding: 0 16px;
        .main {
            display: flex;
            flex-wrap: wrap;
        }
    }
</style>