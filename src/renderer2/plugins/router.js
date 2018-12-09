import Router from 'vue-router'
import pages from '../page/router'

export default function install(Vue) {
    Vue.use(Router)

    const router = new Router({
        linkActiveClass: 'active',
        routes: [
            {
                path: '/',
                redirect: {
                    name: 'discover',
                },
            },
            ...pages,
        ],
    })
    router.beforeEach((to, from, next) => {
        console.log(to)
        next()
    })
    Vue.$router = router
}
