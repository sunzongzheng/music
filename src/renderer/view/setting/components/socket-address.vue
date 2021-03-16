<template>
    <menu-item title="socket服务地址">
        <el-input
            placeholder="请输入完整地址"
            v-model="socketAddress"
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
            socketAddress: Vue.$store.state.user.setting.socketAddress,
        }
    },
    computed: {
        ...mapState('user', ['setting']),
    },
    methods: {
        ...mapMutations('user', ['updateSetting']),
        submit() {
            this.updateSetting({
                socketAddress: this.socketAddress,
            })
            this.$message.success('设置成功')
        },
    },
}
</script>
