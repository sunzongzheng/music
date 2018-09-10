<template>
    <carousel-item title="精选歌单"
                   :list="list"
                   @on-click="goPlaylist"
    >
        <ul :class="s.cate" slot="title-append">
            <li v-for="item in cate"
                :class="{ [s.active]:  chosen === item}"
                @click="choose(item)"
            >
                {{item}}
            </li>
        </ul>
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
                cate: ['华语', '欧美', '日语', '粤语'],
                chosen: eventBus.playlist.chosen,
                list: eventBus.playlist.list
            }
        },
        watch: {
            chosen() {
                this.getList()
            }
        },
        methods: {
            async getList() {
                const data = await this.$musicApi.netease.getTopPlaylist(this.chosen, 1, 20)
                if (data.status) {
                    this.list = eventBus.playlist.list = data.data.map(item => {
                        item.cover = item.coverImgUrl
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
            },
            choose(item) {
                this.chosen = eventBus.playlist.chosen = item
                this.getList()
            }
        },
        created() {
            !this.list.length && this.getList()
        }
    }
</script>
<style lang="scss" module="s">
    .cate {
        display: flex;
        margin-left: 12px;
        li {
            display: flex;
            align-items: center;
            padding: 0 12px;
            color: $color-sub;
            font-size: 12px;
            position: relative;
            top: 1px;
            cursor: pointer;
            &:hover {
                color: $color-content;
            }
            &:not(:last-child)::after {
                content: ' ';
                width: 1px;
                height: 6px;
                background: $color-border1;
                position: absolute;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto;
            }
            &.active {
                color: $color-content;
            }
        }
    }
</style>