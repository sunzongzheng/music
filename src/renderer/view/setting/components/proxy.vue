<template>
    <menu-item title="代理">
        <el-input placeholder="host:port" v-model="proxy" size="small" clearable style="width: 450px">
            <template slot="prepend">Http://</template>
            <el-button slot="append" @click="submit">确定</el-button>
        </el-input>
    </menu-item>
</template>
<script>
    import menuItem from './menu-item.vue'
    import {mapState, mapMutations} from 'vuex'

    export default {
        components: {
            menuItem
        },
        data() {
            return {
                proxy: Vue.$store.state.user.setting.proxy
            }
        },
        computed: {
            ...mapState('user', ['setting'])
        },
        methods: {
            ...mapMutations('user', ['updateSetting']),
            submit() {
                this.updateSetting({
                    proxy: this.proxy
                })
                this.$message.success('设置成功')
            }
        }
    }
</script>