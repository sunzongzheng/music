<template>
    <carousel-item title="热门精选"
                   :list="list"
                   @on-click="goPlaylist"
    >
    </carousel-item>
</template>
<script>
    import carouselItem from './carousel-item.vue'
    import eventBus from '../eventBus'

    export default {
        components: {
            carouselItem
        },
        data() {
            return {
                list: eventBus.playlist.list
            }
        },
        methods: {
            async getList() {
                const data = await this.$musicApi.netease.getPersonalizedPlaylist()
                if (data.status) {
                    this.list = eventBus.playlist.list = data.data.map(item => {
                        item.cover = item.picUrl
                        return item
                    })
                } else {
                    this.$message.warning(data.msg)
                }
            },
            goPlaylist({id}) {
                this.$router.push({
                    name: 'musicPlaylist.detail',
                    params: {
                        id
                    },
                    query: {
                        vendor: 'netease'
                    }
                })
            }
        },
        created() {
            !this.list.length && this.getList()
        }
    }
</script>
<style lang="scss" module="s">
</style>