import Vue from 'vue'

const components = {
    'Icon': require('./icon/index.vue')
}

Object.keys(components).forEach((key) => {
    Vue.component(key, components[key])
})
