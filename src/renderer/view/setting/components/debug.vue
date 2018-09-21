<template>
    <menu-item title="Debug">
        <el-button size="small" :class="s.btn" @click="openConsole">打开控制台</el-button>
    </menu-item>
</template>
<script>
    import menuItem from './menu-item.vue'

    export default {
        components: {
            menuItem
        },
        methods: {
            openConsole() {
                this.$mainWindow.webContents.openDevTools({
                    detach: true
                })
            }
        }
    }
</script>
<style lang="scss" module="s">
    .btn {
        height: 22px;
        padding: 0 24px;
    }
</style>