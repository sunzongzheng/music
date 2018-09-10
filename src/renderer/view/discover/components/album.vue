<template>
    <carousel-item title="新碟上架"
                   :list="list"
                   @on-click="goAlbum"
                   :class="s.album"
    ></carousel-item>
</template>
<script>
    import carouselItem from './carousel-item.vue'

    export default {
        components: {
            carouselItem
        },
        data() {
            return {
                list: []
            }
        },
        methods: {
            async getList() {
                try {
                    const {albums} = await this.$musicApi.netease.instance.post('/weapi/album/new', {
                        offset: 0,
                        total: true,
                        limit: 20,
                        csrf_token: ""
                    })
                    this.list = albums.map(item => {
                        item.cover = item.picUrl
                        return item
                    })
                } catch (e) {
                    console.warn(e)
                    this.$message.warning('获取失败')
                }
            },
            goAlbum({id}) {
                this.$router.push({
                    name: 'album.detail',
                    params: {
                        id
                    },
                    query: {
                        vendor: 'netease'
                    }
                })
            },
        },
        created() {
            this.getList()
        }
    }
</script>
<style lang="scss" module="s">
    .album {
        margin-top: 24px;
    }
</style>