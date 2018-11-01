<template>
    <carousel-item title="QQ音乐个性推荐"
                   :list="list"
                   @on-click="clickHandle"
                   :class="s.qqRecommend"
                   vendor="qq"
    ></carousel-item>
</template>
<script>
    import carouselItem from '../carousel-item.vue'
    import playlistCover from './playlistCover.vue'
    import { mapState, mapActions } from 'vuex'

    export default {
        components: {
            carouselItem,
        },
        data() {
            return {
                list: [],
            }
        },
        methods: {
            ...mapActions('play', ['playAll']),
            async clickHandle(item) {
                if (item.id === 'daily') {
                    const data = await this.$musicApi.qq.getRecommendSongs()
                    if (data.status) {
                        this.playAll(data.data.map(item => {
                            item.vendor = 'qq'
                            item.songId = item.id
                            return item
                        }))
                    } else {
                        this.$message.warning(data.msg)
                    }
                } else {
                    this.$router.push({
                        name: 'musicPlaylist.detail',
                        params: {
                            id: item.content_id,
                        },
                        query: {
                            vendor: 'qq',
                        },
                    })
                }
            },
            async getRecommendPlaylist() {
                const data = await this.$musicApi.qq.getRecommendPlaylist()
                if (data.status) {
                    this.list = [
                        {
                            id: 'daily',
                            cover: h => h(playlistCover),
                            name: '每日歌曲推荐',
                        },
                    ].concat(data.data.slice(0, 9).map(item => {
                        item.name = item.title
                        return item
                    }))
                } else {
                    Vue.$message.warning(data.msg)
                }
            },
        },
        created() {
            this.getRecommendPlaylist()
        },
    }
</script>
<style lang="scss" module="s">
    .qqRecommend {
        margin-top: 24px;
    }
</style>