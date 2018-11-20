export default {
    path: '/playlist',
    name: 'playlist',
    component: require('./index.vue'),
    children: [
        {
            path: 'online.detail',
            name: 'playlist.online.detail',
            component: require('./index.vue'),
        },
        {
            path: 'offline.detail',
            name: 'playlist.offline.detail',
            component: require('./index.vue'),
        },
    ],
}
