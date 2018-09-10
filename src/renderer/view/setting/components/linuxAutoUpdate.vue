<template>
    <menu-item title="Linux下自动更新">
        <div>
            <el-radio v-model="value" :label="true">是</el-radio>
            <el-radio v-model="value" :label="false">否</el-radio>
            <p :class="s.tip">当且仅当安装的是 AppImage 程序时 可用，deb 下请勿打开</p>
        </div>
    </menu-item>
</template>
<script>
    import menuItem from './menu-item.vue'
    import {mapState, mapMutations} from 'vuex'

    export default {
        components: {
            menuItem
        },
        computed: {
            ...mapState('user', ['setting']),
            value: {
                get() {
                    return this.setting.linuxAutoUpdate
                },
                set(val) {
                    this.updateSetting({
                        linuxAutoUpdate: val
                    })
                }
            }
        },
        methods: {
            ...mapMutations('user', ['updateSetting'])
        }
    }
</script>
<style lang="scss" module="s">
    .tip {
        font-size: 12px;
        color: $color-sub;
        margin-top: 4px;
    }
</style>