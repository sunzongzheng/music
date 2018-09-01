<template>
    <div :class="s.artistList" v-loading="loading">
        <div :class="s.tags">
            <div v-for="(tagCate,key) in tags"
                 :class="s.tagCate"
            >
                <div v-for="item in tagCate"
                     :class="{ [s.tagItem]:true, [s.active]: filter[key] === item.id }"
                     @click="changeTag(key, item.id)"
                >
                    {{item.name}}
                </div>
            </div>
        </div>
        <div :class="s.list">
            <div v-for="(artist,index) in artistList"
                 :class="{ [s.artist] : true, [s.withImage] : page === 1 && index < 10 }"
                 :key="artist.singer_id"
            >
                <v-image v-if="page === 1 && index < 10"
                         :src="artist.singer_pic"
                         @click.native="goDetail(artist.singer_id)"
                ></v-image>
                <p @click="goDetail(artist.singer_id)" :title="artist.singer_name">{{artist.singer_name}}</p>
            </div>
            <el-pagination v-if="!loading"
                           layout="prev, pager, next"
                           :total="total"
                           :class="s.pagination"
                           :current-page.sync="page"
                           @current-change="pageChange"
                           :page-size="80"
            ></el-pagination>
        </div>
    </div>
</template>
<script>
    import vImage from './image.vue'

    export default {
        components: {
            vImage
        },
        data() {
            return {
                filter: {
                    area: -100,
                    genre: -100,
                    index: -100,
                    sex: -100
                },
                artistList: [],
                tags: {
                    area: [],
                    genre: [],
                    index: [],
                    sex: []
                },
                loading: false,
                page: 1,
                total: 0
            }
        },
        methods: {
            async getList() {
                this.loading = true
                try {
                    const data = await this.$musicApi.qq.getArtists(this.page - 1, this.filter)
                    if (data.status) {
                        const _data = data.data
                        this.artistList = _data.singerlist
                        this.tags = _data.tags
                        this.filter.area = _data.area
                        this.filter.genre = _data.genre
                        this.filter.index = _data.index
                        this.filter.sex = _data.sex
                        this.total = _data.total
                    } else {
                        this.$message.warning(data.msg)
                    }
                } catch (e) {
                    console.warn(e)
                    e.msg && this.$message.warning(e.msg)
                }
                this.loading = false
            },
            changeTag(key, tag) {
                this.filter[key] = tag
                this.page = 1
                this.getList()
            },
            goDetail(id) {
                this.$router.push({
                    name: 'artist.detail',
                    params: {
                        id
                    },
                    query: {
                        vendor: 'qq'
                    }
                })
            },
            imgError(index) {
                this.artistList[index].singer_pic = 'https://y.gtimg.cn/mediastyle/global/img/singer_300.png?max_age=2592000'
            },
            pageChange(page) {
                this.page = page
                this.getList()
            }
        },
        created() {
            this.getList()
        }
    }
</script>
<style lang="scss" module="s">
    .artistList {
        padding: 24px 18px 0;
        display: flex;
        flex-direction: column;
        height: 100%;
        .tags {
            border-bottom: 1px solid $color-border4;
            height: 130px;
            .tagCate {
                display: flex;
                flex-wrap: wrap;
                font-size: 12px;
                .tagItem {
                    color: $color-sub;
                    padding: 4px 16px 4px 0;
                    margin-bottom: 12px;
                    line-height: 1;
                    cursor: pointer;
                    &:hover {
                        color: $color-primary;
                    }
                    &.active {
                        color: black;
                    }
                }
            }
        }
        .list {
            display: flex;
            flex-wrap: wrap;
            margin-right: -16px;
            margin-top: 24px;
            flex: 1;
            overflow: auto;
            .artist {
                width: 134px;
                margin-right: 16px;
                margin-bottom: 24px;
                font-size: 12px;
                color: $color-content;
                img {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    cursor: pointer;
                }

                p {
                    margin: 0;
                    cursor: pointer;
                    @include text-ellipsis;
                    &:hover {
                        color: $color-primary;
                    }
                }

                &.withImage {
                    padding: 16px;
                    background: #FBFBFB;
                    font-size: 13px;
                    p {
                        margin-top: 12px;
                        text-align: center;
                    }
                }
            }
            .pagination {
                text-align: center;
                width: 100%;
                margin-right: 16px;
            }
        }
    }
</style>