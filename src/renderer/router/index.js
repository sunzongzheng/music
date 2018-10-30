import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    linkActiveClass: 'active',
    routes: [
        {
            path: '/',
            redirect: {
                name: 'discover'
            }
        },
        {
            path: '/discover',
            name: 'discover',
            component: require('@/view/discover/index.vue')
        },
        {
            path: '/rank', // 排行列表
            name: 'rank',
            component: require('@/view/rank/index.vue'),
            redirect: {
                name: 'rank.list'
            },
            children: [
                {
                    path: 'main',
                    name: 'rank.list',
                    component: require('@/view/rank/list/index.vue')
                },
                {
                    path: ':id/detail',
                    name: 'rank.detail',
                    component: require('@/view/rank/detail/index.vue')
                }
            ]
        },
        {
            path: '/searchResult', // 搜索结果
            name: 'searchResult',
            component: require('@/view/searchResult/index.vue')
        },
        {
            path: '/playlist/:id', // 创建的歌单详情
            name: 'playlist',
            component: require('@/view/playlist/index.vue'),
            redirect: {
                name: 'playlist.detail'
            },
            children: [
                {
                    path: 'detail', // 详情
                    name: 'playlist.detail',
                    component: require('@/view/playlist/detail/index.vue'),
                },
                {
                    path: 'import', // 导入
                    name: 'playlist.import',
                    component: require('@/view/playlist/import/index.vue'),
                }
            ]
        },
        {
            path: '/song/:id/comments', // 歌曲评论
            name: 'song.comments',
            component: require('@/view/comments/index.vue')
        },
        {
            path: '/artist', // 歌手详情
            name: 'artist',
            component: require('@/view/artist/index.vue'),
            redirect: {
                name: 'artist.list'
            },
            children: [
                {
                    path: 'list', // 歌手列表
                    name: 'artist.list',
                    component: require('@/view/artist/list/index.vue'),
                },
                {
                    path: ':id/detail', // 歌手详情
                    name: 'artist.detail',
                    component: require('@/view/artist/detail/index.vue'),
                }
            ]
        },
        {
            name: 'share',
            path: '/share',
            component: require('@/view/share.vue')
        },
        {
            path: '/album',
            name: 'album',
            component: require('@/view/album/index.vue'),
            redirect: {
                name: 'album.detail'
            },
            children: [
                {
                    path: ':id/detail',
                    name: 'album.detail',
                    component: require('@/view/album/detail/index.vue'),
                }
            ]
        },
        {
            path: '/musicPlaylist',
            name: 'musicPlaylist',
            component: require('@/view/musicPlaylist/index.vue'),
            redirect: {
                name: 'musicPlaylist.detail'
            },
            children: [
                {
                    path: ':id/detail',
                    name: 'musicPlaylist.detail',
                    component: require('@/view/musicPlaylist/detail/index.vue'),
                }
            ]
        },
        {
            path: '/mv',
            name: 'mv',
            component: require('@/view/mv/index.vue'),
            redirect: {
                name: 'mv.detail'
            },
            children: [
                {
                    path: ':id/detail',
                    name: 'mv.detail',
                    component: require('@/view/mv/detail/index.vue'),
                }
            ]
        },
        {
            path: '/setting',
            component: require('@/view/setting/index.vue')
        },
        {
            name: 'add-to-playlist',
            path: '/add-to-playlist',
            component: require('@/view/add-to-playlist.vue')
        },
        {
            name: 'download',
            path: '/download',
            component: require('@/view/download.vue')
        },
        {
            name: 'chat',
            path: '/chat',
            component: require('@/view/chat/index.vue')
        },
        {
            name: 'local-songs',
            path: '/local-songs',
            component: require('@/view/local-songs.vue'),
        },
    ]
})
router.beforeEach((to, from, next) => {
    console.log(to)
    next()
})
export default router

