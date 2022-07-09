import dayjs from 'dayjs'

const getVendor = url => {
    if (/gtimg.cn/.test(url)) {
        return 'qq'
    } else if (/xiami/.test(url)) {
        return 'xiami'
    } else if (/126\.net/.test(url)) {
        return 'netease'
    } else {
        console.warn(`未知vendor: ${url}`)
    }
}
export default function install(Vue) {
    Vue.filter('date', function(value) {
        return dayjs(value).format('YYYY-MM-DD')
    })
    Vue.filter('image', (url, width = 140) => {
        if (!url) return require('../assets/album.png')
        let qqWidth
        if (width <= 150) {
            qqWidth = 150
        } else if (width <= 300) {
            qqWidth = 300
        } else if (width <= 500) {
            qqWidth = 500
        } else {
            qqWidth = 800
        }
        return {
            netease: `${url}?param=${width}y${width}`,
            xiami: `${url}@1e_1c_100Q_${width}w_${width}h`,
            qq: url.replace('300x300', `${qqWidth}x${qqWidth}`),
        }[getVendor(url)]
    })
    Vue.filter('source', val => {
        return {
            qq: 'QQ音乐',
            netease: '网易云',
            xiami: '虾米音乐',
        }[val]
    })
}
