<template>
    <div :class="s.avatar">
        <el-popover
            :popper-class="s.avatarPopover"
            placement="bottom"
            v-model="popover.logout"
            ref="popover"
            trigger="hover"
        >
            <p @click="logout" v-if="info" :class="s.logout">退出账号</p>
            <template v-else>
                <div :class="s.loginMethod">
                    <div @click="showLoginDialog('qq')">
                        <Icon type="QQ"></Icon>
                        <span>QQ</span>
                    </div>
                    <div @click="showLoginDialog('weibo')">
                        <Icon type="weibo"></Icon>
                        <span>微博</span>
                    </div>
                    <div @click="showLoginDialog('github')">
                        <Icon type="github"></Icon>
                        <span>Github</span>
                    </div>
                </div>
                <div :class="s.loginWithBrowser">
                    <el-checkbox v-model="loginWithBrowser"
                        >使用你的浏览器进行登录</el-checkbox
                    >
                </div>
            </template>
        </el-popover>
        <img :src="info | avatar" v-popover:popover />
        <span :class="s.nickname">{{ info | nickname }}</span>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import Login from './login'
import config from '../../../../../../config/index'

export default {
    data() {
        return {
            popover: {
                logout: false,
                login: false,
            },
            loginWithBrowser: true,
        }
    },
    computed: {
        ...mapState('user', ['info']),
    },
    filters: {
        avatar: info => (info ? info.avatar : require('@/assets/user.png')),
        nickname: info => (info ? info.nickname : '登录'),
    },
    methods: {
        showLoginDialog(type) {
            new Login(`${config.api}/auth/${type}`, this.loginWithBrowser)
        },
        // 退出
        logout() {
            this.$store.dispatch('user/logout')
        },
    },
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
        background-color: #d6d6d6;
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
        background-color: #ecebeb;
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

    .logout {
        font-size: 12px;
        cursor: pointer;

        &:hover {
            color: #26b36c;
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
                opacity: 0.8;
            }
        }
    }
    .loginWithBrowser {
        margin-top: 12px;
        text-align: center;
    }
}
</style>
