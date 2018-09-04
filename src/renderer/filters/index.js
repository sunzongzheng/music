import moment from 'moment'

Vue.filter('source', val => {
    return {
        'qq': 'QQ音乐',
        'netease': '网易云',
        'xiami': '虾米音乐'
    }[val]
})
Vue.filter('image', (url, vendor, width = 140) => {
    if (!url) return require('../assets/defaultAlbum.png')
    return {
        netease: `${url}?param=${width}y${width}`,
        xiami: `${url}@1e_1c_100Q_${width}w_${width}h`,
        qq: url.replace('300x300', `150x150`)
    }[vendor]
})
Vue.filter('defaultAlbum', info => {
    if (info && info.album && info.album.cover) {
        return {
            netease: `${info.album.cover}?param=140y140`,
            xiami: `${info.album.cover}@1e_1c_100Q_140w_140h`,
            qq: info.album.cover.replace('300x300', '150x150')
        }[info.vendor] || ''
    } else {
        return require('../assets/defaultAlbum.png')
    }
})
Vue.filter('date', (val, format = 'YYYY-MM-DD') => {
    return moment(val).format(format)
})
Vue.filter('dateDiff', (val, format) => {
    return moment(val).fromNow()
})
Vue.filter('keyboardChar', (val) => {
    if (!val) return ''
    return val.split('+').map(item => Vue.$store.getters['hot-key/registerKey2Char'][item]).join(' ')
})