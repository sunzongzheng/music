<template>
    <div :class="s.setting">
        <p :class="s.title">设置</p>
        <menu-item title="Linux下自动更新">
            <div>
                <el-radio v-model="includeLinux" :label="true">是</el-radio>
                <el-radio v-model="includeLinux" :label="false">否</el-radio>
                <p :class="s.tip">当且仅当安装的是 AppImage 程序时 可用，deb 下请勿打开</p>
            </div>
        </menu-item>
        <menu-item title="版本">
            <div style="display:flex;">
                <p :class="s.content">当前版本：V{{version}}</p>
                <div style="margin-left: 24px;">
                    <el-button size="small"
                               :class="s.btn"
                               @click="checkUpdate"
                               :loading="loading.checkUpdate"
                    >
                        检查更新
                    </el-button>
                    <el-button size="small" :class="s.btn" @click="openIssues">意见反馈</el-button>
                </div>
            </div>
        </menu-item>
    </div>
</template>
<script>
    import menuItem from './components/menu-item.vue'
    import {remote} from 'electron'

    export default {
        components: {
            menuItem
        },
        data() {
            return {
                includeLinux: Boolean(localStorage.getItem('includeLinux')),
                version: remote.app.getVersion(),
                loading: {
                    checkUpdate: false
                }
            }
        },
        watch: {
            includeLinux(val) {
                if (val) {
                    localStorage.setItem('includeLinux', true)
                } else {
                    localStorage.removeItem('includeLinux')
                }
            }
        },
        methods: {
            // 检查更新
            async checkUpdate() {
                this.loading.checkUpdate = true
                try {
                    const rs = await this.$updater.__judgeUpdater(localStorage.getItem('includeLinux'))
                    if (rs) {
                        this.$updater.updateAvailableCallback()
                    } else {
                        this.$message.success('您目前已经是最新版本')
                    }
                } catch (e) {
                    console.warn(e)
                }
                this.loading.checkUpdate = false
            },
            // 意见反馈
            openIssues() {
                remote.shell.openExternal('https://github.com/sunzongzheng/music/issues/new')
            }
        }
    }
</script>
<style lang="scss" module="s">
    .setting {
        padding: 24px;
        .title {
            font-size: 20px;
            color: $color-title;
            padding-bottom: 16px;
            border-bottom: 1px solid $color-border4;
        }
        .tip {
            font-size: 12px;
            color: $color-sub;
            margin-top: 4px;
        }
        .content {
            font-size: 14px;
            color: $color-content;
        }
        .btn {
            height: 21px;
            padding: 0 24px;
            margin-left: 4px;
        }
    }
</style>