<template>
    <div :class="s.comments" v-loading="loading.info || loading.comment">
        <div style="height: 100%" v-if="loading.info || loading.comment"></div>
        <template v-else>
            <top-info :info="info"></top-info>
            <comment-list :vendor="vendor"
                          :hotComments="hotComments"
                          :comments="comments"
                          :total="total"
            ></comment-list>
            <el-pagination layout="prev, pager, next"
                           :total="total"
                           style="text-align: center; margin-top: 8px;"
                           :current-page.sync="page"
                           @current-change="pageChange"
                           :page-size="limit"
            ></el-pagination>
        </template>
    </div>
</template>
<script>
    import topInfo from './topInfo.vue'

    export default {
        components: {
            topInfo,
        },
        data() {
            return {
                info: {},
                loading: {
                    info: false,
                    comment: false
                },
                comments: [],
                hotComments: [],
                total: 0,
                page: 1,
                limit: 20
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
        watch: {
            '$route'() {
                this.total = 0
                this.page = 1
                this.getInfo()
                this.getComment()
            }
        },
        methods: {
            // 获取歌曲信息
            async getInfo() {
                this.loading.info = true
                try {
                    const data = await Vue.$musicApi.getSongDetail(this.vendor, this.id)
                    if (data.status) {
                        for (let i in data.data) {
                            Vue.set(this.info, i, data.data[i])
                        }
                        Vue.set(this.info, 'vendor', this.vendor)
                    }
                } catch (e) {
                    console.warn(e)
                }
                this.loading.info = false
            },
            // 获取评论
            async getComment() {
                this.loading.comment = true
                try {
                    const data = await Vue.$musicApi.getComment(this.vendor, this.id, this.page, this.limit)
                    if (data.status) {
                        this.comments = data.data.comments
                        this.hotComments = data.data.hotComments
                        this.total = data.data.total
                    }
                } catch (e) {
                }
                this.loading.comment = false
            },
            pageChange(page) {
                this.page = page
                this.getComment()
            }
        },
        created() {
            this.getInfo()
            this.getComment()
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
        height: 100%;
    }
</style>