<template>
    <li :class="s.item">
        <template v-if="info">
            <div :class="s.cover">
                {{info.name}}
                <Icon type="play1" :class="s.play" @click.native="playList(info.list)"></Icon>
            </div>
            <div :class="s.img">
                <img :src="info.list[0].album.cover"/>
            </div>
            <ul :class="s.songs" @click="go2RankList">
                <li v-for="(song,index) in info.list.splice(0,3)" :class="s.song">
                    <span>{{index + 1}}</span>
                    <span>{{song.name}}</span>-
                    <span>
                    <template v-for="singer in song.artists">
                        {{singer.name}}
                    </template>
                </span>
                </li>
            </ul>
        </template>
    </li>
</template>
<script>
  import eventBus from '../eventBus'

  export default {
    props: {
      id: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        info: null
      }
    },
    methods: {
      async getInfo() {
        try {
          console.log(this.$api)
          let {data} = await this.$api.getTopList(this.id.toString())
          data.list = data.list.map(item => {
            item.source = 'netease'
            if (item.album.cover) {
              item.album.cover += '?param=140y140'
            }
            return item
          })
          this.info = data
        } catch (e) {
          console.warn(e)
        }
      },
      // 播放排行榜
      playList(list) {
        this.$store.dispatch('api/play', list[0])
        this.$store.commit('c_playlist/update', list)
      },
      // 跳转至排行榜详情
      go2RankList() {
        eventBus.rankInfo = this.info
        this.$router.push({name: 'rank.detail'})
      }
    },
    created() {
      this.getInfo()
    }
  }
</script>
<style lang="scss" module="s">
    .item {
        display: inline-flex;
        width: calc(50% - 10px);
        height: 120px;
        margin-bottom: 20px;
        position: relative;
        margin-right: 10px;
        background-color: #f9f9f9;
        .cover {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            left: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.6);
            color: white;
            z-index: 2;
            transition: all .2s;
            text-align: center;
            user-select: none;
            .play {
                display: none;
                position: absolute;
                cursor: pointer;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                margin: auto;
                color: white;
                font-size: 40px;
                padding: 8px;
                padding-left: 12px;
                border-radius: 50%;
                background-color: #29c777;
                transition: all .2s;
                &:hover {
                    transition: all .2s;
                    background-color: #26A866;
                }
            }
            &:hover {
                transition: all .2s;
                background-color: rgba(0, 0, 0, 0.2);
                .play {
                    display: block;
                }
                & + .img > img {
                    transform: scale(1.2, 1.2);
                }
            }
        }
        .img,
        .cover {
            width: 120px;
            height: 100%;
        }
        .img {
            overflow: hidden;
            img {
                transition: all .2s;
                width: 100%;
                height: 100%;
            }
        }
        .songs {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            padding: 20px 16px;
            list-style: none;
            background-color: #FBFBFB;
            cursor: pointer;
            width: calc(100% - 120px);
            &:hover {
                background-color: #f2f2f2;
            }
            .song {
                font-size: 13px;
                color: #231919;
                & > span {
                    display: inline-block;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    vertical-align: middle;
                }
                span:nth-child(2) {
                    width: 120px;
                }
                span:nth-child(3) {
                    width: 75px;
                }
            }
        }
    }
</style>