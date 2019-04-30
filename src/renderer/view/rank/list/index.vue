<template>
    <div :class="s.app" v-loading="loading">
        <p>
            {{text}}音乐排行榜
            <Icon type="qiehuan1" :class="s.icon" @click="changeVendor"></Icon>
        </p>
        <ul :class="s.main">
            <v-item v-for="item in list"
                    :key="item.id"
                    :info="item"
                    :vendor="vendor"
                    :class="s.item"
            ></v-item>
        </ul>
    </div>
</template>
<script>
    import vItem from './item.vue'
    import eventBus from '../eventBus'

    export default {
        name: 'rank',
        components: {vItem},
        data() {
            return {
                list: [],
                vendor: localStorage.getItem('rank-vendor') || 'netease',
                loading: false
            }
        },
        computed: {
            text() {
                return {
                    netease: '网易云',
                    qq: 'QQ'
                }[this.vendor]
            }
        },
        methods: {
            async getData(limit) {
                this.list = []
                this.loading = true
                try {
                    const data = await eventBus.getRank(
                        this.vendor,
                        this.vendor === 'netease' ? {
                            ids: Array.from(new Array(22), (value, index) => {
                                return index.toString()
                            }),
                            limit
                        } : {
                            limit
                        }
                    )
                    this.list = data.filter(item => this.vendor !== 'qq' || item.id !== 201)
                } catch (e) {
                }
                this.loading = false
            },
            changeVendor() {
                const meta = ['netease', 'qq']
                const index = (meta.indexOf(this.vendor) + 1) % 2
                this.vendor = meta[index]
                localStorage.setItem('rank-vendor', this.vendor)
                this.getData(3)
            }
        },
        async created() {
            this.getData(3) // 先调一次 limit:3 用于首屏
            // this.getData() // 获取全量数据
        }
    }
</script>
<style lang="scss" module="s">
    .app {
        padding: 0 16px;
        overflow: hidden;
        min-height: 400px;
        & > p {
            margin: 16px 0;
            .icon {
                color: $color-sub;
                cursor: pointer;
                font-size: 12px;
                margin-bottom: 2px;
                &:hover {
                    color: $color-primary;
                }
            }
        }
        .main {
            display: flex;
            flex-wrap: wrap;
            margin-right: -20px;
        }
    }
</style>