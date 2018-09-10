<template>
    <menu-item title="版本">
        <div style="display:flex; align-items: center;">
            <p :class="s.content">当前版本：V{{version}}</p>
            <div style="margin-left: 24px;">
                <el-button size="small"
                           :class="s.btn"
                           @click="checkUpdate"
                           :loading="loading"
                >
                    检查更新
                </el-button>
                <el-button size="small" :class="s.btn" @click="openIssues">意见反馈</el-button>
            </div>
        </div>
    </menu-item>
</template>
<script>
    import menuItem from './menu-item.vue'
    import {remote} from 'electron'

    export default {
        components: {
            menuItem
        },
        data() {
            return {
                version: remote.app.getVersion(),
                loading: false
            }
        },
        methods: {
            // 检查更新
            async checkUpdate() {
                this.loading = true
                try {
                    const rs = await this.$updater.__judgeUpdater(this.setting.linuxAutoUpdate)
                    if (rs) {
                        this.$updater.updateAvailableCallback()
                    } else {
                        this.$message.success('您目前已经是最新版本')
                    }
                } catch (e) {
                    console.warn(e)
                }
                this.loading = false
            },
            // 意见反馈
            openIssues() {
                remote.shell.openExternal('https://github.com/sunzongzheng/music/issues/new')
            }
        }
    }
</script>
<style lang="scss" module="s">
    .btn {
        height: 22px;
        padding: 0 24px;
        margin-left: 4px;
    }
</style>