import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            component: require('@/view/main/index.vue'),
            redirect: {
                name: 'rank'
            },
            children: [
                {
                    path: '/searchResult', // 搜索结果
                    name: 'searchResult',
                    component: require('@/view/main/searchResult/index.vue')
                },
                {
                    path: '/playlist/:id', // 创建的歌单详情
                    name: 'playlist',
                    component: require('@/view/main/playlist/index.vue'),
                    redirect: {
                        name: 'playlist.detail'
                    },
                    children: [
                        {
                            path: 'detail', // 详情
                            name: 'playlist.detail',
                            component: require('@/view/main/playlist/detail/index.vue'),
                        },
                        {
                            path: 'import', // 导入
                            name: 'playlist.import',
                            component: require('@/view/main/playlist/import/index.vue'),
                        }
                    ]
                },
                {
                    path: '/rank', // 排行列表
                    name: 'rank',
                    component: require('@/view/rank/index.vue'),
                    redirect: {
                        name: 'rank.main'
                    },
                    children: [
                        {
                            path: 'main',
                            name: 'rank.main',
                            component: require('@/view/rank/main/index.vue')
                        },
                        {
                            path: 'detail',
                            name: 'rank.detail',
                            component: require('@/view/rank/detail/index.vue')
                        }
                    ]
                },
                {
                    path: '/song/:id/comments', // 歌曲评论
                    name: 'song.comments',
                    component: require('@/view/comments/index.vue')
                },
                {
                    path: '/artist/:id', // 歌手详情
                    name: 'artist',
                    component: require('@/view/artist/index.vue')
                },
            ]
        },
        {
            path: '/share',
            component: require('@/view/share.vue')
        }
    ],
    scrollBehavior(to, from, savedPosition) {
        return {x: 0, y: 0}
    }
})
router.beforeEach((to, from, next) => {
    console.log(to)
    next()
})
export default router

