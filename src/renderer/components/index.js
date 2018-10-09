import Vue from 'vue'

const components = {
    'Icon': require('./icon/index.vue'),
    'AddToPlaylist': require('./addToPlaylist/index.vue'),
    'DataTable': require('./dataTable/index.vue'),
    'DetailHeader': require('./detailHeader.vue'),
    'commentList': require('./comment/index.vue'),
    'quality': require('./quality.vue')
}

Object.keys(components).forEach((key) => {
    Vue.component(key, components[key])
})
