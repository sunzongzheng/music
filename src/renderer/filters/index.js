import Vue from 'vue'

Vue.filter('source', function (val) {
  return {
    'qq': 'QQ音乐',
    'netease': '网易云',
    'xiami': '虾米音乐'
  }[val]
})
