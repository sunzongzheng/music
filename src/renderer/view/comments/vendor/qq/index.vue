<template>
    <div :class="s.netease">
        <title-bar :title="`精彩评论（${hotComments.length}）`"></title-bar>
        <ul>
            <v-item v-for="item in hotComments"
                    :key="item.id"
                    :info="item"
            ></v-item>
        </ul>
        <title-bar :title="`最新评论（${comments.length}）`" style="margin-top: 24px"></title-bar>
        <ul>
            <v-item v-for="item in comments"
                    :key="item.id"
                    :info="item"
            ></v-item>
        </ul>
    </div>
</template>
<script>
  import titleBar from '../../titleBar.vue'
  import eventBus from '../../eventBus'
  import vItem from './item.vue'

  export default {
    components: {
      titleBar,
      vItem
    },
    computed: {
      hotComments() {
        return eventBus.hotComments
      },
      comments() {
        return eventBus.comments
      }
    }
  }
</script>
<style lang="scss" module="s">
    .netease {

    }
</style>