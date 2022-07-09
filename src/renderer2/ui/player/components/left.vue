<template>
    <div :class="s.left">
        <div :class="s.cover"><img :src="_song.album.cover | image(72)" /></div>
        <div :class="s.info">
            <span :class="s.name">{{ _song.name }}</span>
            <span :class="s.artists" v-if="_song.artists.length">
                {{ _song.artists.map(item => item.name).join(' ') }}
            </span>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import defaultAlbum from '../../../assets/album.png'

export default {
    props: {
        cover: String,
        name: String,
        artists: Array,
    },
    computed: {
        ...mapGetters('playing', ['song']),
        _song() {
            return this.song
                ? this.song
                : {
                      name: '听你想听的歌',
                      album: {
                          cover: null,
                      },
                      artists: [],
                  }
        },
    },
}
</script>
<style lang="scss" module="s">
.left {
    position: absolute;
    left: 24px;
    top: 0;
    bottom: 0;
    margin: auto;
    display: flex;
    align-items: center;
    .cover {
        font-size: 0;
        img {
            @include size(36px);
            border: 1px solid gainsboro;
        }
    }
    .info {
        display: flex;
        flex-direction: column;
        margin-left: 8px;
        font-size: 12px;
    }
}
</style>
