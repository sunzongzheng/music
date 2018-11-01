<template>
    <div :class="s.discover">
        <banner></banner>
        <netease-recomment v-if="bind.netease"></netease-recomment>
        <qq-recomment v-if="bind.qq"></qq-recomment>
        <playlist></playlist>
        <album></album>
        <mv></mv>
    </div>
</template>
<script>
    import banner from './components/banner.vue'
    import playlist from './components/playlist.vue'
    import album from './components/album.vue'
    import mv from './components/mv.vue'
    import neteaseRecomment from './components/netease-recommend/index.vue'
    import qqRecomment from './components/qq-recommend/index.vue'
    import { mapGetters } from 'vuex'

    export default {
        components: {
            banner,
            playlist,
            album,
            mv,
            neteaseRecomment,
            qqRecomment,
        },
        computed: {
            ...mapGetters('user', ['bind']),
        },
    }
</script>
<style lang="scss" module="s">
    .discover {
        padding: 28px 16px;
        background: #FAFAFA;
    }
</style>