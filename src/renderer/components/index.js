import Vue from 'vue'

const components = {
  'LeftMenu': require('./leftMenu/index.vue'),
  'Icon': require('./icon/index.vue'),
  'SearchBar': require('./searchBar/index.vue'),
  'SearchResult': require('./searchResult/index.vue'),
  'Player': require('./player/index.vue')
}

Object.keys(components).forEach((key) => {
  Vue.component(key, components[key])
})
