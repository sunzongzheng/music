import moment from 'moment'

Vue.filter('source', val => {
  return {
    'qq': 'QQ音乐',
    'netease': '网易云',
    'xiami': '虾米音乐'
  }[val]
})
Vue.filter('defaultAlbum', val => {
  return val || require('../assets/defaultAlbum.png')
})
Vue.filter('date', (val, format) => {
  return moment(val).format(format)
})
Vue.filter('dateDiff', (val, format) => {
  return moment(val).fromNow()
})