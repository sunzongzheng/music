<template>
    <menuItem title="绑定云平台账号">
        <div :class="s.bind">
            <div :class="s.item" @click="handle('netease')">
                <netease-icon :class="s.icon"
                              :active="bind.netease"
                ></netease-icon>
                <p :class="s.nickname">{{setting.bind.netease.nickname || '未绑定'}}</p>
            </div>
            <div :class="s.item" @click="handle('qq')">
                <qqmusic-icon :class="s.icon"
                              :active="bind.qq"
                ></qqmusic-icon>
                <p :class="s.nickname">{{setting.bind.qq.nickname || '未绑定'}}</p>
            </div>
            <p :class="s.tip">绑定成功后请在<span>&nbsp;精选&nbsp;</span>分类查收个性化推荐！</p>
        </div>
    </menuItem>
</template>
<script>
    import menuItem from '../menu-item.vue'
    import netease from './bind-netease-window'
    import qq from './bind-qq-window'
    import { mapState, mapMutations, mapGetters } from 'vuex'

    export default {
        components: {
            menuItem,
        },
        data() {
            return {
                bindWindow: {
                    netease,
                    qq,
                },
            }
        },
        computed: {
            ...mapState('user', ['setting']),
            ...mapGetters('user', ['bind']),
        },
        methods: {
            ...mapMutations('user', ['updateBind', 'unBind']),
            handle(vendor) {
                if (this.setting.bind[vendor].cookies) {
                    this.$confirm('解绑后精选分类不再有个性化推荐', '取消绑定', {
                        confirmButtonText: '解绑',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        this.unBind(vendor)
                    })
                } else {
                    this.$confirm('绑定信息只存储在当前客户端，不同设备间无法同步', '绑定', {
                        confirmButtonText: '绑定',
                        cancelButtonText: '算了',
                        type: 'warning',
                    }).then(() => {
                        this.bindWindow[vendor].init()
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