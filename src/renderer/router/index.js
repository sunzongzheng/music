import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {name: 'home'}
    },
    {
      path: '/home',
      name: 'home',
      component: require('@/view/home/index.vue'),
      redirect: {name: 'searchResult'},
      children: [{
        path: '/searchResult',
        name: 'searchResult',
        component: require('@/view/home/searchResult/index.vue')
      }, {
        path: '/playlist/:id',
        name: 'playlist',
        component: require('@/view/home/playlist/index.vue')
      }]
    }
  ]
})
