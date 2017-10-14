<template>
    <div :class="s.app">
        <left-menu style="width: 200px;"></left-menu>
        <div :class="s.right">
            <search-bar :class="s.searchBar"></search-bar>
            <search-result :class="s.searchResult"></search-result>
        </div>
        <player :class="s.player"></player>
    </div>
</template>
<script>
  export default {}
</script>
<style lang="scss" module="s">
    .app {
        display: flex;
        flex-flow: row wrap;
        height: 100%;
    }

    .right {
        width: calc(100% - 200px);
    }

    .searchBar {
        height: 45px;
    }

    .searchResult {
        height: calc(100% - 45px);
    }
</style>