<template>
    <div :class="s.searchResult">
        <div :class="s.top">
            <div :class="s.title">
                <span>搜索</span>
                <span :class="s.keyword">{{keyword}}</span>
            </div>
            <el-tabs v-model="vendor" @tab-click="search" :class="s.tabs">
                <el-tab-pane label="网易云" name="netease"></el-tab-pane>
                <el-tab-pane label="QQ音乐" name="qq"></el-tab-pane>
                <el-tab-pane label="虾米音乐" name="xiami"></el-tab-pane>
            </el-tabs>
        </div>
        <DataTable :data="list"
                   :loading="loading"
                   :showTopBar="false"
                   :class="s.table"
                   hideLastCol
        ></DataTable>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                loading: false,
                list: [],
                vendor: 'netease',
            }
        },
        computed: {
            keyword() {
                return this.$route.query.keyword
            }
        },
        watch: {
            'keyword'() {
                this.search()
            },
        },
        methods: {
            async search({ name } = { name: this.vendor }) {
                this.loading = true
                const data = await this.$musicApi[name].search({
                    keyword: this.keyword,
                })
                this.list = data.songs
                console.log(this.list)
                this.loading = false
            },
        },
        created() {
            this.search()
        },
        beforeRouteEnter(to, from, next) {
            if (typeof to.query.keyword === 'undefined') {
                Vue.$router.push('/')
            } else {
                next()
            }
        },
    }
</script>
<style lang="scss" module="s">
    .searchResult {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
        .top {
            margin: 24px 20px 0;
            position: relative;
            .title {
                position: absolute;
                left: 0;
                top: 8px;
                margin: auto;
                display: flex;
                max-width: 200px;
                font-size: 20px;
                color: #191919;
                align-items: center;
                line-height: 1;
                @include text-ellipsis;
                .keyword {
                    color: #FC581F;
                }
            }
            :global {
                .el-tabs__nav {
                    float: right;
                    padding-right: 24px;
                }
                .el-tabs__nav-wrap::after {
                    height: 1px;
                }
            }
        }
        .table {
            padding: 0 12px 12px;
            flex: 1;
            overflow: auto;
        }
    }
</style>