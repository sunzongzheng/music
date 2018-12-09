export default {
    path: '/music-lake-playlist',
    name: 'music-lake-playlist',
    component: require('./index.vue'),
    children: [
        {
            path: ':type/:id/detail',
            name: 'music-lake-playlist.detail',
            component: require('./detail/index.vue'),
        },
        {
            path: ':type/:id/import',
            name: 'music-lake-playlist.import',
            component: require('./import/index.vue'),
        },
    ],
}
