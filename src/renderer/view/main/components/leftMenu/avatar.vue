<template>
    <div :class="s.app" @click="onClick">
        <el-popover popper-class="avatarPopover"
                    :disabled="!info"
                    ref="popover1"
                    placement="bottom"
                    trigger="hover">
            <span @click="logout">退出账号</span>
        </el-popover>
        <img :src="info | avatar" v-popover:popover1>
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
      onClick() {
        // 已登录
        if (this.info) {

        } else { // 未登录
          this.$ipc.send('login')
        }
      },
      // 退出
      logout() {
        this.$store.dispatch('user/logout')
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
<style lang="scss">
    .avatarPopover {
        -webkit-app-region: no-drag;
        span {
            font-size: 12px;
            cursor: pointer;
            &:hover {
                color: #26B36C;
            }
        }
    }
</style>