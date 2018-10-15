<template>
    <div :class="s.searchResult">
        <div :class="s.top">
            <a :class="s.title"><span>搜索</span><span :class="s.keyword">{{keywords}}</span></a>
            <el-checkbox v-model="filter.netease">网易云</el-checkbox>
            <el-checkbox v-model="filter.qq">QQ音乐</el-checkbox>
            <el-checkbox v-model="filter.xiami">虾米音乐</el-checkbox>
            <el-checkbox v-model="filter.unique">去重</el-checkbox>
            <el-checkbox v-model="filter.cp">包含无版权歌曲</el-checkbox>
        </div>
        <DataTable :data="result"
                   :loading="loading"
                   style="padding: 0 12px"
                   :pagination="false"
                   element-loading-text="拼命加载中...搜索三个平台...还要花时间去重哦~"
        ></DataTable>
    </div>
</template>
<script>
    import {mapState, mapActions} from 'vuex'
    import eventBus from '@/eventBus/searchResult'

    export default {
        data() {
            return {
                filter: {
                    cp: true,  // 是否包含无版权歌曲
                    netease: true,
                    xiami: true,
                    qq: true,
                    unique: true, // 是否去重
                },
            }
        },
        computed: {
            ...mapState('search', ['keywords', 'loading']),
            result() {
                // 为了避免深拷贝一份数据 此处使用递归filter
                const dealFuncs = []
                if (this.filter.unique) {
                    dealFuncs.push(function (arr) {
                        const result = []
                        const resultFeatureList = [] // 特征数组 用于快速判断重复
                        for (let i in arr) {
                            const cur = arr[i]
                            // 检查是否已存在同名 同歌手 同专辑 且能够播放
                            const feature = (cur.name + cur.artists.map(item => item.name).join('') + cur.album.name).replace(/\s/g, '')
                            const sameIndex = resultFeatureList.indexOf(feature)
                            if (sameIndex > -1) { // 如果有重复的
                                // 如果当前可听，历史不可听 则替换
                                if (!cur.cp && resultFeatureList[sameIndex].cp) {
                                    result.splice(sameIndex, 1, cur)
                                }
                                continue
                            } else {
                                result.push(cur)
                                resultFeatureList.push(feature)
                            }
                        }
                        return dealFuncs.length ? dealFuncs.pop()(result) : result
                    })
                }
                if (!this.filter.cp) {
                    dealFuncs.push(function (arr) {
                        const result = arr.filter(item => !item.cp)
                        return dealFuncs.length ? dealFuncs.pop()(result) : result
                    })
                }
                if (!this.filter.netease) {
                    dealFuncs.push(function (arr) {
                        const result = arr.filter(item => item.vendor !== 'netease')
                        return dealFuncs.length ? dealFuncs.pop()(result) : result
                    })
                }
                if (!this.filter.qq) {
                    dealFuncs.push(function (arr) {
                        const result = arr.filter(item => item.vendor !== 'qq')
                        return dealFuncs.length ? dealFuncs.pop()(result) : result
                    })
                }
                if (!this.filter.xiami) {
                    dealFuncs.push(function (arr) {
                        const result = arr.filter(item => item.vendor !== 'xiami')
                        return dealFuncs.length ? dealFuncs.pop()(result) : result
                    })
                }
                return dealFuncs.length ? dealFuncs.pop()(eventBus.searchResult) : eventBus.searchResult
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
    .searchResult {
        .top {
            display: flex;
            justify-content: space-between;
            padding: 0 20px;
            margin: 24px 0;
            align-items: flex-end;
            .title {
                display: flex;
                width: 100%;
                font-size: 20px;
                color: #191919;
                align-items: center;
                line-height: 1;
                .keyword {
                    color: #FC581F;
                }
            }
            :global {
                .el-checkbox + .el-checkbox {
                    margin-left: 12px;
                }
            }
        }
    }
</style>