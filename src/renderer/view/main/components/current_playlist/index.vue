<template>
    <div v-if="play.info" :class="{[s.app]:true,[s.active]:show,[s.lyricShow]:lyricShow}" v-clickoutside="closeModal">
        <div v-for="item in playlist"
             :class="{[s.item]:true,[s.active]:play.info.id===item.id}"
             @click="doPlay(item)"
        >
            <div :class="s.album_wrap">
                <img :class="s.album" :src="item | defaultAlbum"/>
            </div>
            <div :class="s.main">
                <span :class="s.name">{{item.name}}</span>
                <span :class="s.singer">{{item.artists[0].name}}</span>
            </div>
        </div>
    </div>
</template>
<script>
  import Clickoutside from 'element-ui/src/utils/clickoutside'
  import { mapState, mapActions, mapGetters } from 'vuex'

  export default {
    directives: {Clickoutside},
    computed: {
      ...mapState('c_playlist', ['show']),
      ...mapGetters('c_playlist', ['playlist']),
      ...mapState('api', ['play']),
      ...mapState('lyrics', {
        lyricShow: 'show'
      }),
    },
    methods: {
      ...mapActions('api', {
        doPlay: 'play'
      }),
      closeModal(e) {
        if (this.show) {
          this.$store.commit('c_playlist/toggle')
        }
      }
    }
  }
</script>
<style lang="scss" module="s">
    .app {
        $width: 300px;
        position: fixed;
        right: 0;
        top: 0;
        width: 300px;
        height: calc(100% - 60px);
        transform: translate3d(100%, 0, 0);
        will-change: transform;
        transition: all .5s;
        background-color: white;
        box-shadow: 0 0 6px #ececec;
        overflow-y: auto;
        overflow-x: hidden;
        z-index: 6;
        &.lyricShow {
            box-shadow: none;
        }
        &.active {
            transform: translate3d(0, 0, 0);
            will-change: transform;
            transition: all .5s;
        }
    }

    .item {
        display: flex;
        width: 100%;
        padding: 16px;
        transition: background-color .2s;
        cursor: pointer;
        .album_wrap {
            width: 50px;
            height: 50px;
            transition: all .2s;
            .album {
                width: 100%;
                height: 100%;
            }
        }
        .main {
            color: #555;
            display: inline-flex;
            flex-direction: column;
            justify-content: center;
            margin-left: 20px;
            & > * {
                display: flex;
            }
            .name {
                font-size: 14px;
            }
            .singer {
                font-size: 13px;
            }
        }
        &:hover {
            background-color: rgba(38, 179, 108, 0.5);
            transition: background-color .2s;
            * {
                color: white;
            }
        }
        &.active {
            .album_wrap {
                transition: all .2s;
                width: 80px;
                height: 80px;
            }
        }
    }
</style>