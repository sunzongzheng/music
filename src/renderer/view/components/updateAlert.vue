<template>
    <div :class="s.updateAlert">
        检测到可用更新，立即<a @click="download">前往下载</a>
    </div>
</template>
<script>
    import {shell} from 'electron'

    export default {
        methods: {
            download() {
                shell.openExternal('https://github.com/sunzongzheng/music/releases')
            }
        }
    }
</script>
<style lang="scss" module="s">
    .updateAlert {
        a {
            color: $color-primary;
            cursor: pointer;
        }
    }
</style>