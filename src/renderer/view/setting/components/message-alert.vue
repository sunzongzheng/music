<template>
    <menu-item title="提醒">
        <el-checkbox v-model="value">消息提示音</el-checkbox>
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
                    return this.setting.messageAlert
                },
                set(val) {
                    this.updateSetting({
                        messageAlert: val
                    })
                }
            }
        },
        methods: {
            ...mapMutations('user', ['updateSetting'])
        }
    }
</script>