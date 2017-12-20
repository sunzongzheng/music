<template>
    <div :class="s.app">
        <p>网易云音乐排行榜</p>
        <ul :class="s.main">
            <li v-for="item in list"
                :class="s.item"
            >
                <div :class="s.cover">
                    {{item.name}}
                    <Icon type="play1" :class="s.play" @click.native="playList(item.list)"></Icon>
                </div>
                <div :class="s.img">
                    <img :src="item.list[0].album.cover"/>
                </div>
                <ul :class="s.songs" @click="go2RankList(item)">
                    <li v-for="(song,index) in item.list.splice(0,3)" :class="s.song">
                        <span>{{index + 1}}</span>
                        <span>{{song.name}}</span>-
                        <span>
                            <template v-for="singer in song.artists">
                                {{singer.name}}
                            </template>
                        </span>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>
<script>
  import { mapState } from 'vuex'

  export default {
    data() {
      return {
        list: []
      }
    },
    computed: {
      ...mapState('rank', ['rankList']),
    },
    methods: {
      // 获取排行榜
      async getList() {
        for (let i = 0; i < 21; i++) {
          try {
            const {data} = await this.$api.getTopList(i.toString())
            this.list.push(data)
          } catch (e) {
            console.warn(e)
          }
        }
      },
      // 播放排行榜
      playList(list) {
        list = list.map(item => {
          return {
            ...item,
            source: 'netease'
          }
        })
        this.$store.dispatch('api/play', list[0])
        this.$store.commit('c_playlist/update', list.splice(0, 30))
      },
      // 跳转至排行榜详情
      go2RankList(info) {
        this.$store.commit('rank/update', {
          info
        })
        this.$router.push({name: 'rank.detail'})
      }
    },
    created() {
      this.getList()
    }
  }
</script>
<style lang="scss" module="s" src="./index.scss"></style>