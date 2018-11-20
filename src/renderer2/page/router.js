export default [
    {
        path: '/discover',
        name: 'discover',
        component: require('./discover/index.vue'),
    },
    require('./playlist/router').default,
]
