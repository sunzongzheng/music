<template>
    <div :class="s.main">
        <a :class="s.title">搜索<span>{{keywords}}</span></a>
        <DataTable :data="result"
                   :loading="loading"
                   element-loading-text="拼命加载中...搜索三个平台...还要花时间去重哦~"
        ></DataTable>
    </div>
</template>
<script>
    import {mapState, mapActions} from 'vuex'
    import eventBus from '@/eventBus/searchResult'

    export default {
        computed: {
            ...mapState('search', ['keywords', 'loading']),
            result() {
                return eventBus.searchResult
            }
        },
        methods: {
            ...mapActions('play', ['play'])
        },
        beforeRouteEnter(to, from, next) {
            if (Vue.$store.state.search.keywords.length > 0) {
                next()
            } else {
                Vue.$router.push('/')
            }
        }
    }
</script>
<style lang="scss" module="s">
    .main {
        padding: 0 16px;
        .title {
            display: flex;
            width: 100%;
            font-size: 20px;
            color: #191919;
            height: 46px;
            padding-top: 16px;
            align-items: center;
            span {
                color: #FC581F;
            }
        }
    }
</style>