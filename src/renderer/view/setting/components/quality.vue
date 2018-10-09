<template>
    <menu-item title="优先试听音质">
        <el-radio-group v-model="value">
            <el-radio :label="999000">无损品质</el-radio>
            <el-radio :label="320000">高品质</el-radio>
            <el-radio :label="128000">标准品质</el-radio>
        </el-radio-group>
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
                    return this.setting.quality
                },
                set(val) {
                    this.updateSetting({
                        quality: val
                    })
                }
            }
        },
        methods: {
            ...mapMutations('user', ['updateSetting'])
        }
    }
</script>