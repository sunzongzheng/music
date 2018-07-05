<template>
    <div :class="s.playlist">
        <router-view></router-view>
    </div>
</template>
<style lang="scss" module="s">
    .playlist {
        padding: 16px;
    }
</style>