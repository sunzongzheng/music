<template>
    <div :class="s.mvDetail" v-loading="loading.getDetail || loading.getComment">
        <div v-if="loading.getDetail || loading.getComment" style="height: 100%;"></div>
        <template v-else>
            <div :class="s.topInfo">
                <span :class="s.name">{{info.name}}</span>
                <span :class="s.count">播放次数：{{info.playCount}}次</span>
            </div>
            <video :src="url" controls="controls"></video>
            <div :class="s.bottomInfo">
                <div :class="s.artist">
                    <router-link v-for="item in info.artists"
                                 :key="item.id"
                                 :to="{ name: 'artist.detail', params: { id: item.id }, query: { vendor: vendor } }"
                    >
                        {{item.name}}
                    </router-link>
                </div>
                <span :class="s.publishTime">
                        发布时间：{{info.publishTime}}
                    </span>
            </div>
            <comment-list :class="s.comments"
                          :vendor="vendor"
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
    export default {
        data() {
            return {
                loading: {
                    getDetail: false,
                    getComment: false,
                },
                info: {
                    artists: [],
                    name: '',
                    cover: '',
                    publishTime: '',
                    playCount: 0,
                    desc: '',
                    brs: {
                        240: '',
                        480: ''
                    }
                },
                vendor: 'netease',
                hotComments: [],
                comments: [],
                total: 0,
                page: 1,
                limit: 20
            }
        },
        computed: {
            id() {
                return this.$route.params.id
            },
            url() {
                return this.info.brs['1080'] || this.info.brs['720'] || this.info.brs['480'] || this.info.brs['240']
            }
        },
        methods: {
            async getDetail() {
                this.loading.getDetail = true
                const data = await this.$musicApi.netease.getMvDetail(this.id)
                if (data.status) {
                    this.info = data.data
                }
                this.loading.getDetail = false
            },
            async getComment() {
                this.loading.getComment = true
                const data = await this.$musicApi.netease.getMvComment(this.id, this.page, this.limit)
                if (data.status) {
                    this.hotComments = data.data.hotComments
                    this.comments = data.data.comments
                    this.total = data.data.total
                }
                this.loading.getComment = false
            },
            pageChange(page) {
                this.page = page
                this.getComment()
            }
        },
        created() {
            this.getDetail()
            this.getComment()
        }
    }
</script>
<style lang="scss" module="s">
    .mvDetail {
        height: 100%;
        padding: 16px 20px;
        .topInfo {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
            .name {
                font-size: 22px;
            }
            .count {
                display: flex;
                align-items: flex-end;
                font-size: 13px;
                color: $color-sub;
            }
        }
        video {
            width: 100%;
        }
        .bottomInfo {
            display: flex;
            margin-top: 8px;
            .artist {
                margin-right: 12px;
            }
            .publishTime {
                display: flex;
                align-items: flex-end;
                font-size: 13px;
                color: $color-sub;
            }
        }
        .comments {
            padding: 0;
            margin-top: 24px;
        }
    }
</style>