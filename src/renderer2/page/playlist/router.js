export default {
    path: '/playlist',
    name: 'playlist',
    component: require('./index.vue'),
    children: [
        {
            path: ':type/:id/detail',
            name: 'playlist.detail',
            component: require('./detail/index.vue'),
        },
        {
            path: ':type/:id/import',
            name: 'playlist.import',
            component: require('./import/index.vue'),
        },
    ],
}
