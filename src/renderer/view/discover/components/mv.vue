<template>
    <carousel-item title="最新MV"
                   :list="list"
                   @on-click="goMv"
                   :class="s.mv"
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
                    const {data} = await this.$musicApi.netease.instance.post('/weapi/mv/first', {
                        total: true,
                        limit: 20,
                        csrf_token: ""
                    })
                    this.list = data
                } catch (e) {
                    console.warn(e)
                    this.$message.warning('获取失败')
                }
            },
            goMv({id}) {
                this.$router.push({
                    name: 'mv.detail',
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
    .mv {
        margin-top: 24px;
    }
</style>