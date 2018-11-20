<template>
    <div :class="s.unlogged">
        <p :class="s.tip">请选择登录方式</p>
        <div :class="s.loginMethod">
            <div @click="showLoginDialog('qq')">
                <Icon type="QQ"></Icon>
                <span>QQ登录</span>
            </div>
            <div @click="showLoginDialog('weibo')">
                <Icon type="weibo"></Icon>
                <span>微博登录</span>
            </div>
        </div>
    </div>
</template>
<script>
import weibo from './weibo-login'
import qq from './qq-login'

export default {
    data() {
        return {
            loginWindow: {
                weibo,
                qq,
            },
        }
    },
    methods: {
        showLoginDialog(type) {
            this.loginWindow[type].init()
        },
    },
}
</script>
<style lang="scss" module="s">
.unlogged {
    .tip {
        font-size: 12px;
        margin-bottom: 12px;
        text-align: center;
        color: $color-sub;
    }
    .loginMethod {
        display: flex;
        justify-content: space-around;
        & > div {
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            svg {
                font-size: 32px;
            }
            span {
                margin-top: 8px;
                font-size: 13px;
            }
            &:hover {
                opacity: 0.8;
            }
        }
    }
}
</style>
