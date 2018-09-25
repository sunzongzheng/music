<template>
    <keep-alive include="rankList">
        <router-view></router-view>
    </keep-alive>
</template>
<script>
    export default {
        name: 'rank'
    }
</script>