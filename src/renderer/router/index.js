import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: require('@/view/main/index.vue'),
      redirect: {
        name: 'rank'
      },
      children: [
        {
          path: '/searchResult',
          name: 'searchResult',
          component: require('@/view/main/searchResult/index.vue')
        }, {
          path: '/playlist/:id',
          name: 'playlist',
          component: require('@/view/main/playlist/index.vue')
        },
        {
          path: '/rank',
          name: 'rank',
          component: require('@/view/rank/index.vue')
        }
      ]
    }
  ]
})
