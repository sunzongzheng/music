export default {
    name: 'artist',
    path: '/artist',
    component: require('./index.vue'),
    children: [
        {
            name: 'artist.detail',
            path: ':id/detail',
            component: require('./detail/index.vue'),
        },
    ],
}
