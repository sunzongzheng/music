<template>
    <div :class="s.app" @click="onClick">
        <img :src="info | avatar">
        <span :class="s.nickname">{{info | nickname}}</span>
    </div>
</template>
<script>
  import { mapState } from 'vuex'

  export default {
    computed: {
      ...mapState('user', ['info'])
    },
    filters: {
      avatar: (info) => info ? info.avatar : require('@/assets/user.png'),
      nickname: (info) => info ? info.nickname : '登录'
    },
    methods: {
      onClick () {
        // 已登录
        if (this.info) {

        } else { // 未登录
          this.$ipc.send('login')
        }
      }
    }
  }
</script>
<style lang="scss" module="s">
    .app {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        padding: 24px 10px 20px 10px;
        position: relative;
        img {
            $width: 45px;
            width: $width;
            height: $width;
            border-radius: 50%;
            cursor: pointer;
            background-color: #D6D6D6;
            user-select: none;
            -webkit-app-region: no-drag;
        }
        .nickname {
            margin-top: 8px;
            font-size: 13px;
            color: #222;
            -webkit-app-region: no-drag;
        }
        &:after {
            position: absolute;
            content: ' ';
            background-color: #ECEBEB;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            height: 1px;
            width: 180px;
        }
    }
</style>