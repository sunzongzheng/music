export default {
    name: 'album',
    path: '/album',
    component: require('./index.vue'),
    children: [
        {
            name: 'album.detail',
            path: ':id/detail',
            component: require('./detail/index.vue'),
        },
    ],
}
