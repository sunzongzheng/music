<template>
    <div :class="s.avatar">
        <el-popover :popper-class="s.avatarPopover"
                    placement="bottom"
                    v-model="popover.logout"
                    ref="popover"
                    trigger="hover"
        >
            <span @click="logout" v-if="info">退出账号</span>
            <div :class="s.loginMethod" v-else>
                <div @click="showLoginDialog('qq')">
                    <Icon type="QQ"></Icon>
                    <span>QQ登录</span>
                </div>
                <div @click="showLoginDialog('weibo')">
                    <Icon type="weibo"></Icon>
                    <span>微博登录</span>
                </div>
            </div>
        </el-popover>
        <img :src="info | avatar" v-popover:popover>
        <span :class="s.nickname">{{info | nickname}}</span>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import weiboLogin from './weibo-login'

    export default {
        data() {
            return {
                popover: {
                    logout: false,
                    login: false
                }
            }
        },
        computed: {
            ...mapState('user', ['info'])
        },
        filters: {
            avatar: (info) => info ? info.avatar : require('@/assets/user.png'),
            nickname: (info) => info ? info.nickname : '登录'
        },
        methods: {
            showLoginDialog(type) {
                if (type === 'qq') {
                    this.$ipc.send('login')
                } else {
                    weiboLogin.init()
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
    .avatar {
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

    .avatarPopover {
        -webkit-app-region: no-drag;
        span {
            font-size: 12px;
            cursor: pointer;
            &:hover {
                color: #26B36C;
            }
        }
        .loginMethod {
            display: flex;
            justify-content: space-around;
            & > div {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 0 12px;
                svg {
                    font-size: 32px;
                    cursor: pointer;
                }
                span {
                    margin-top: 8px;
                }
                &:hover {
                    opacity: .8;
                }
            }
        }
    }
</style>