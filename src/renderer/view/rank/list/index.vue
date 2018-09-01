<script title="text/jsx">
    import vItem from './item.vue'
    import eventBus from '../eventBus'

    export default {
        components: {vItem},
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
                    eventBus.list = data.map(single => {
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
            },
            getRenderData() {
                return (
                    <div class={this.s.app}>
                        <p>网易云音乐排行榜</p>
                        <ul class={this.s.main}>
                            {
                                eventBus.list.map((item, index) => {
                                    return (
                                        <v-item info={item} id={index} class={this.s.item}></v-item>
                                    )
                                })
                            }
                        </ul>
                    </div>
                )
            }
        },
        async created() {
            // 没有缓存则 初始化
            if (!eventBus.renderCache) {
                await this.getData(3) // 先调一次 limit:3 用于首屏
                this.$forceUpdate()
                this.getData() // 获取全量数据
            }
        },
        render() {
            // 有缓存 直接返回缓存
            if (eventBus.renderCache) {
                return eventBus.renderCache
            } else { // 没有缓存
                // 有数据就生成 vNode 并缓存
                if(eventBus.list[0]) {
                    eventBus.renderCache = this.getRenderData()
                    return eventBus.renderCache
                } else {
                    // 没有数据就直接返 vNode
                    return this.getRenderData()
                }
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