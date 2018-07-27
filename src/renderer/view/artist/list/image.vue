<template>
    <img :src="url" @error="imgError"/>
</template>
<script>
    export default {
        props: {
            src: String
        },
        data() {
            return {
                hasError: false
            }
        },
        computed: {
            url() {
                return this.hasError ? 'https://y.gtimg.cn/mediastyle/global/img/singer_300.png?max_age=2592000' : this.src
            }
        },
        methods: {
            imgError() {
                this.hasError = true
            }
        }
    }
</script>