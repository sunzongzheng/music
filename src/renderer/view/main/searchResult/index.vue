<template>
    <div :class="s.main">
        <a :class="s.title">搜索<span>{{search.keywords}}</span></a>
        <el-table :data="result"
                  :class="s.table"
                  :row-class-name="s.row"
                  v-loading="search.loading"
                  element-loading-text="拼命加载中...搜索三个平台...还要花时间去重哦~"
        >
            <el-table-column label="歌曲" :width="220">
                <template scope="scope">
                    <div :class="s.nameItem">
                        <div :class="s.songName" :title="scope.row.name">{{scope.row.name}}</div>
                        <div :class="s.songControl">
                            <Icon type="item-play" @click.native="doPlay(scope.row)"></Icon>
                            <add-to-playlist :info="scope.row"></add-to-playlist>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="歌手">
                <template scope="scope">
                    {{scope.row.artists[0].name}}
                </template>
            </el-table-column>
            <el-table-column prop="album.name" label="专辑"></el-table-column>
            <el-table-column label="来源">
                <template scope="scope">
                    {{scope.row.source | source}}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
  import { mapState, mapActions } from 'vuex'
  import moment from 'moment'
  import eventBus from '@/eventBus/searchResult'

  export default {
    filters: {
      minute(val) {
        return moment(val).format('mm:ss')
      }
    },
    computed: {
      ...mapState('api', ['search']),
      result() {
        return eventBus.searchResult
      }
    },
    methods: {
      ...mapActions('api', ['play']),
      doPlay(item) {
        this.$store.commit('c_playlist/update', [])
        this.play(item)
      }
    },
    beforeRouteEnter(to, from, next) {
      if (Vue.store.state.api.search.keywords.length > 0) {
        next()
      } else {
        Vue.router.push('/')
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
        .table {
            width: 100%;
            .row {
                &:hover {
                    .songControl {
                        display: inline-flex;
                        align-items: center;
                    }
                }
            }
            .nameItem {
                display: flex;
                .songName {
                    width: 160px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .songControl {
                    display: none;
                    width: 60px;
                    svg {
                        margin-left: 6px;
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>