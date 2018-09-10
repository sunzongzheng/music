<script type="text/jsx">
    import banner from './components/banner.vue'
    import playlist from './components/playlist.vue'
    import album from './components/album.vue'
    import mv from './components/mv.vue'

    export default {
        components: {
            banner,
            playlist,
            album,
            mv
        },
        render() {
            return (
                <div class={this.s.discover}>
                    <banner></banner>
                    <playlist></playlist>
                    <album></album>
                    <mv></mv>
                </div>
            )
        }
    }
</script>
<style lang="scss" module="s">
    .discover {
        padding: 28px 16px;
        background: #FAFAFA;
    }
</style>