<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
  export default {
    name: 'player'
  }
</script>

<style>
    html,
    body {
        margin: 0;
        padding: 0;
        height: 100%;
    }

    ul, li {
        margin: 0;
        padding: 0;
    }

    * {
        box-sizing: border-box;
    }

    #app {
        height: 100%;
        -webkit-app-region: no-drag;
    }
</style>
