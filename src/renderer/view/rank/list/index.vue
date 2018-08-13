<template>
    <div :class="s.app">
        <p>网易云音乐排行榜</p>
        <ul :class="s.main">
            <v-item v-for="(item,index) in list"
                    :key="index"
                    :id="index"
                    :class="s.item"
            ></v-item>
        </ul>
    </div>
</template>
<script>
    import vItem from './item.vue'

    export default {
        components: {vItem},
        data() {
            return {
                list: new Array(21)
            }
        }
    }
</script>
<style lang="scss" module="s">
    .app {
        padding: 0 16px;
        overflow: hidden;
        & > p {
            margin: 16px 0;
        }
        .main {
            display: flex;
            flex-wrap: wrap;
            margin-right: -20px;
        }
    }
</style>