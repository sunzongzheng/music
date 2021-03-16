<template>
    <menu-item title="云歌单服务地址">
        <el-input
            placeholder="请输入完整地址"
            v-model="apiAddress"
            size="small"
            clearable
            style="width: 450px; margin-top: -6px;"
        >
            <el-button slot="append" @click="submit">确定</el-button>
        </el-input>
    </menu-item>
</template>
<script>
import menuItem from './menu-item.vue'
import { mapState, mapMutations } from 'vuex'

export default {
    components: {
        menuItem,
    },
    data() {
        return {
            apiAddress: Vue.$store.state.user.setting.apiAddress,
        }
    },
    computed: {
        ...mapState('user', ['setting']),
    },
    methods: {
        ...mapMutations('user', ['updateSetting']),
        submit() {
            this.updateSetting({
                apiAddress: this.apiAddress,
            })
            this.$message.success('设置成功')
        },
    },
}
</script>
