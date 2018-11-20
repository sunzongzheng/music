import Vuex from 'vuex'

const files = require.context('../store', false, /\.js$/)
const modules = {}

files.keys().forEach(key => {
    modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})

export default function(Vue) {
    Vue.use(Vuex)
    const store = new Vuex.Store({
        modules,
        strict: process.env.NODE_ENV !== 'production',
    })
    Vue.$store = Vue.prototype.$store = store
}
