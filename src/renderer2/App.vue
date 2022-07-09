<template>
    <div :class="s.app">
        <left-menu></left-menu>
        <div :class="s.right">
            <top-section></top-section>
            <div :class="s.main">
                <router-view></router-view>
            </div>
        </div>
        <player></player>
        <playlist></playlist>
        <simplify-player :class="s.simplifyPlayer"></simplify-player>
    </div>
</template>
<script>
    import leftMenu from './ui/left-menu/index.vue'
    import topSection from './ui/top-section/index.vue'
    import player from './ui/player/index.vue'
    import playlist from './ui/playlist/index.vue'
    import simplifyPlayer from './ui/simplify-player/index.vue'
    import { mapGetters, mapActions, mapState } from 'vuex'

    export default {
        components: {
            leftMenu,
            topSection,
            player,
            playlist,
            simplifyPlayer,
        },
        computed: {
            ...mapGetters('user', ['logged']),
            ...mapState('window', ['mode']),
        },
        methods: {
            ...mapActions('user', ['init']),
        },
        mounted() {
            this.$nextTick(() => {
                document.body.removeChild(document.querySelector('#page-loading'))
            })
        },
        created() {
            if (this.logged) {
                this.init()
            }
        },
    }
</script>
<style lang="scss" module="s">
    html,
    body {
        margin: 0;
        padding: 0;
        @include size(100%);
    }

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    .app {
        display: flex;
        flex-flow: row wrap;
        overflow: hidden;
        @include size(100%);
        .right {
            background: white;
            display: flex;
            flex: 1;
            flex-direction: column;
            overflow: auto;
            .main {
                flex: 1;
                overflow: auto;
                padding-bottom: $player-height;
            }
        }
        a {
            color: $color-content;
            &:hover {
                color: $color-primary;
            }
        }
        .simplifyPlayer {
            display: none;
            position: fixed;
            z-index: 200;
            left: 0;
            top: 0;
            background: #f8f9f8;
            width: 100%;
            height: 100%;
        }
        @media screen and (max-width: 320px){
            .simplifyPlayer {
                display: flex;
            }
        }
    }
</style>
