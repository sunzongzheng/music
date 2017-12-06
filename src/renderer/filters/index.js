import Vue from 'vue'

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
