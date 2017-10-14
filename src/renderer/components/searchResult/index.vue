<template>
    <div :class="s.main" v-if="search.result.length">
        <a :class="s.title">搜索<span>{{search.keywords}}</span></a>
        <el-table :data="search.result" :class="s.table">
            <el-table-column label="歌曲">
                <template scope="scope">
                    <a @click="play(scope.row)">{{scope.row.name}}</a>
                </template>
            </el-table-column>
            <el-table-column label="歌手">
                <template scope="scope">
                    {{scope.row.artists[0].name}}
                </template>
            </el-table-column>
            <el-table-column prop="album.name" label="专辑"></el-table-column>
            <!--<el-table-column label="时长">-->
            <!--<template scope="scope">-->
            <!--{{scope.row.duration | minute}}-->
            <!--</template>-->
            <!--</el-table-column>-->
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

  export default {
    filters: {
      minute (val) {
        return moment(val).format('mm:ss')
      },
      source (val) {
        return {
          'qq': 'QQ音乐',
          'netease': '网易云',
          'xiami': '虾米音乐'
        }[val]
      }
    },
    computed: {
      ...mapState('api', ['search'])
    },
    methods: {
      ...mapActions('api', ['play'])
    },
    created () {

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
            height: calc(100% - 46px);
            overflow: auto;
        }
    }
</style>