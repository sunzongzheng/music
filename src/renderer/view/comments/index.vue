<template>
    <div :class="s.comments" v-loading="loading.info">
        <top-info :info="info"></top-info>
        <component v-loading="loading.comment"
                   :is="`${vendor}Comments`"
                   :class="s.component"
        ></component>
    </div>
</template>
<script>
    import topInfo from './topInfo.vue'
    import neteaseComments from './vendor/netease/index.vue'
    import qqComments from './vendor/qq/index.vue'
    import xiamiComments from './vendor/xiami/index.vue'
    import eventBus from './eventBus'

    export default {
        name: 'comments',
        components: {
            topInfo,
            neteaseComments,
            qqComments,
            xiamiComments
        },
        data() {
            return {
                info: {},
                loading: {
                    info: false,
                    comment: false
                }
            }
        },
        computed: {
            vendor() {
                return this.$route.query.vendor
            },
            id() {
                return this.$route.params.id
            },
        },
        methods: {
            // 获取歌曲信息
            async getInfo(vendor = this.vendor, id = this.id) {
                this.loading.info = true
                try {
                    const data = await Vue.$musicApi.getSongDetail(vendor, id)
                    console.log(data)
                    if (data.status) {
                        this.getComment(data.data.id)
                        for (let i in data.data) {
                            Vue.set(this.info, i, data.data[i])
                        }
                        Vue.set(this.info, 'vendor', vendor)
                    }
                } catch (e) {
                    console.warn(e)
                }
                this.loading.info = false
            },
            // 获取评论
            async getComment(id) {
                this.loading.comment = true
                try {
                    const data = await Vue.$musicApi.getComment(this.vendor, id)
                    console.log(data)
                    if (data.status) {
                        eventBus.comments = data.data.comments
                        eventBus.hotComments = data.data.hotComments
                        eventBus.total = data.data.total
                    }
                } catch (e) {
                }
                this.loading.comment = false
            }
        },
        created() {
            this.getInfo()
        },
        beforeRouteUpdate(to, from, next) {
            eventBus.hotComments.length = 0
            eventBus.comments.length = 0
            eventBus.total = 0
            this.getInfo(to.query.vendor, to.params.id)
            next()
        },
        beforeRouteEnter(to, from, next) {
            const allows = ['netease', 'qq', 'xiami']
            if (allows.includes(to.query.vendor)) {
                next()
            }
        }
    }
</script>
<style lang="scss" module="s">
    .comments {
        .component {
            padding: 24px;
        }
    }
</style>