import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    linkActiveClass: 'active',
    routes: [
        {
            path: '/',
            redirect: {
                name: 'rank'
            }
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
                    path: 'detail',
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
            path: '/share',
            component: require('@/view/share.vue')
        }
    ]
})
router.beforeEach((to, from, next) => {
    console.log(to)
    next()
})
export default router

