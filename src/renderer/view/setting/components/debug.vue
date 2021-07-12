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

export default {
    components: {
        menuItem,
    },
    methods: {
        openConsole() {
            this.$mainWindow.webContents.openDevTools({
                detach: true,
            })
        },
        backup() {
            const data = new Blob([JSON.stringify(localStorage, null, 2)], {
                type: 'application/json',
            })
            const url = URL.createObjectURL(data)
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
            if (file) {
                const reader = new FileReader()
                reader.onload = function(loadEvent) {
                    /**
                     * @type {string}
                     */
                    const contents = loadEvent.target.result
                    try {
                        const restoreJson = JSON.parse(contents)
                        for (const key in restoreJson) {
                            localStorage.setItem(key, restoreJson[key])
                        }
                        alert('导入成功！请重启应用。')
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
