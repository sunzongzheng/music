<template>
    <menu-item title="Debug">
        <el-button size="small" :class="s.btn" @click="openConsole"
            >打开控制台</el-button
        >
        <el-button size="small" :class="s.btn" @click="backup"
            >备份数据</el-button
        >
        <el-button size="small" :class="s.btn" @click="restore">
            导入数据
            <input
                id="input-restore"
                accept=".json,application/json"
                multiple="false"
                v-show="false"
                @change="readSingleFile"
                type="file"
            />
        </el-button>
    </menu-item>
</template>
<script>
import menuItem from './menu-item.vue'
import { remote } from 'electron'
import compareVersions from 'compare-versions'

export default {
    components: {
        menuItem,
    },
    data() {
        return {
            RESTORE_SUPPORT_VERSION_FROM: '1.3.1',
        }
    },
    methods: {
        openConsole() {
            this.$mainWindow.webContents.openDevTools({
                detach: true,
            })
        },
        backup() {
            const backupObject = {
                version: remote.app.getVersion(),
                data: localStorage,
            }
            const jsonFile = new Blob([JSON.stringify(backupObject, null, 2)], {
                type: 'application/json',
            })
            const url = URL.createObjectURL(jsonFile)
            const aElement = document.createElement('a')
            aElement.href = url
            aElement.download = 'backup.json'
            aElement.click()
        },
        restore() {
            document.getElementById('input-restore').click()
        },
        readSingleFile(changeEvent) {
            const file = changeEvent.target.files[0]
            const thisComponent = this
            if (file) {
                const reader = new FileReader()
                reader.onload = function(loadEvent) {
                    /**
                     * @type {string}
                     */
                    const contents = loadEvent.target.result
                    try {
                        const backupObject = JSON.parse(contents)

                        // Check if the version is not correct
                        if (
                            !backupObject.version || // version field not exists
                            compareVersions(
                                backupObject.version,
                                thisComponent.RESTORE_SUPPORT_VERSION_FROM
                            ) < 0 || // version is less than RESTORE_SUPPORT_VERSION_FROM
                            compareVersions(
                                backupObject.version,
                                remote.app.getVersion()
                            ) > 0 // version is greater than current version
                        ) {
                            throw new Error(`不支持导入这个版本的数据！`)
                        } // TODO support convert old version
                        if (typeof backupObject.data === 'object') {
                            for (const key in backupObject) {
                                localStorage.setItem(key, backupObject[key])
                            }
                            alert('导入成功！请重启应用。')
                        } else {
                            alert('数据格式错误！')
                        }
                    } catch (error) {
                        alert(error)
                    }
                }
                reader.readAsText(file)
                changeEvent.currentTarget.value = '' // Clean value. Support opening same file in the next time.
            }
        },
    },
}
</script>
<style lang="scss" module="s">
.btn {
    height: 22px;
    padding: 0 24px;
}
</style>
