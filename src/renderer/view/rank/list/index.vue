<template>
    <div :class="s.app">
        <p>网易云音乐排行榜</p>
        <ul :class="s.main">
            <v-item v-for="(item,index) in list"
                    :key="index"
                    :info="item"
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
                list: new Array(22)
            }
        },
        methods: {
            async getData(limit) {
                try {
                    const data = await this.$http.get('/music/netease/rank', {
                        params: {
                            ids: Array.from(new Array(22), (value, index) => {
                                return index.toString()
                            }),
                            limit
                        }
                    })
                    this.list = data.map(single => {
                        single.list = single.list.map(item => {
                            item.vendor = 'netease'
                            item.songId = item.commentId = item.id
                            return item
                        })
                        return single
                    })
                } catch (e) {
                    console.warn(e)
                }
            }
        },
        async created() {
            // 先调一次 limit:3 用于首屏
            await this.getData(3)
            this.getData()
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