<template>
    <menuItem title="绑定云平台账号">
        <div :class="s.bind">
            <div :class="s.item" @click="bindNetease">
                <netease-icon :class="s.icon"
                              :active="Boolean(setting.bind.netease.cookies)"
                ></netease-icon>
                <p :class="s.nickname">{{setting.bind.netease.nickname || '未绑定'}}</p>
            </div>
            <div :class="s.item">
                <qqmusic-icon :class="s.icon"></qqmusic-icon>
                <p :class="s.nickname">{{setting.bind.qq.nickname || '未绑定'}}</p>
            </div>
            <p :class="s.tip">绑定成功后请在<span>&nbsp;精选&nbsp;</span>分类查收个性化推荐！</p>
        </div>
    </menuItem>
</template>
<script>
    import menuItem from '../menu-item.vue'
    import netease from './bind-netease-window'
    import { mapState, mapMutations } from 'vuex'

    export default {
        components: {
            menuItem,
        },
        computed: {
            ...mapState('user', ['setting']),
        },
        methods: {
            ...mapMutations('user', ['updateBind', 'unBind']),
            bindNetease() {
                if (this.setting.bind.netease.cookies) {
                    this.$confirm('解绑后精选分类不再有个性化推荐', '取消绑定', {
                        confirmButtonText: '解绑',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        this.unBind('netease')
                    })
                } else {
                    this.$confirm('绑定信息只存储在当前客户端，不同设备间无法同步', '绑定', {
                        confirmButtonText: '绑定',
                        cancelButtonText: '算了',
                        type: 'warning',
                    }).then(() => {
                        netease.init()
                    })
                }
            },
        },
    }
</script>
<style lang="scss" module="s">
    .bind {
        .item {
            display: inline-flex;
            align-items: center;
            margin-right: 16px;
            cursor: pointer;
            .icon {
                margin-right: 4px;
            }

            .nickname {
                line-height: 1;
                color: $color-sub;
            }
        }
        .tip {
            color: $color-disabled;
            margin-top: 4px;
            font-size: 12px;
            span {
                color: $color-sub;
            }
        }
    }
</style>