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
                <ul :class="s.songs">
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
  export default {
    data() {
      return {
        list: [],
      }
    },
    methods: {
      async getList() {
        try {
          for (let i = 0; i < 16; i++) {
            const {data} = await this.$api.getTopList(i.toString())
            this.list.push(data)
          }
        } catch (e) {
          console.log(e)
        }
        console.log(this.list)
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
      }
    },
    created() {
      this.getList()
    }
  }
</script>
<style lang="scss" module="s">
    .app {
        padding: 0 16px;
        .main {
            display: flex;
            flex-wrap: wrap;
            .item {
                display: inline-flex;
                width: 50%;
                height: 120px;
                margin-bottom: 20px;
                position: relative;
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
        }
    }
</style>