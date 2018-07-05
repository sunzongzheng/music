<template>
    <div :class="s.app">
        <left-menu></left-menu>
        <div :class="s.right">
            <search-bar></search-bar>
            <div :class="s.main">
                <router-view></router-view>
            </div>
        </div>
        <player></player>
        <lyrics></lyrics>
        <play-list></play-list>
        <download-progress></download-progress>
    </div>
</template>

<script>
    import leftMenu from './view/components/leftMenu/index.vue'
    import searchBar from './view/components/searchBar/index.vue'
    import player from './view/components/player/index.vue'
    import lyrics from './view/components/lyrics/index.vue'
    import playList from './view/components/current_playlist/index.vue'
    import downloadProgress from './view/components/progress/index.vue'

    export default {
        components: {
            leftMenu,
            searchBar,
            player,
            lyrics,
            playList,
            downloadProgress
        },
        methods: {
            // 登录成功回调
            loginSuccessed(event, info) {
                console.log(info)
                // 更新userInfo
                this.$store.commit('user/update', {
                    nickname: info.nickname,
                    avatar: info.avatar
                })
                // 更新token
                this.$store.commit('token/update', info.token)
            },
        },
        created() {
            // 初始化离线歌单
            Vue.store.dispatch('offline-playlist/init')
            this.$ipc.on('loginSuccessed', this.loginSuccessed)
            if (localStorage.token) {
                this.$store.dispatch('user/init')
            }
        }
    }
</script>
<style>
    html,
    body {
        margin: 0;
        padding: 0;
        height: 100%;
        font-family: arial, "Hiragino Sans GB", "Microsoft YaHei",
        "WenQuanYi Micro Hei", sans-serif;
        background: white;
    }

    ul, li {
        margin: 0;
        padding: 0;
    }

    * {
        box-sizing: border-box;
    }

    #app {
        height: 100%;
        background-color: white;
        -webkit-app-region: no-drag;
    }

    ::-webkit-scrollbar {
        width: 4px;
        height: 8px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #e0e0e0;
    }
</style>

<style lang="scss" module="s">
    .app {
        display: flex;
        flex-flow: row wrap;
        height: 100%;
        position: relative;
        .right {
            width: calc(100% - #{$leftmenu-width});
            padding-bottom: 60px;
        }

        .main {
            height: calc(100% - #{$searchBar-height});
            overflow: auto;
        }
    }
</style>