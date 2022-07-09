export default [
    {
        path: '/discover',
        name: 'discover',
        component: require('./discover/index.vue'),
    },
    require('./playlist/router').default,
    require('./aritist/router').default,
    require('./album/router').default,
    require('./music-lake-playlist/router').default,
    {
        path: '/search-result',
        name: 'search-result',
        component: require('./search-result/index.vue'),
    }
]
