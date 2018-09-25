<template>
    <router-view></router-view>
</template>
<script>
    export default {
        mounted() {
            document.body.querySelector('#page-loading').style.display = 'none'
        },
    }
</script>
<style>
    html,
    body {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        -webkit-app-region: no-drag;
    }
</style>