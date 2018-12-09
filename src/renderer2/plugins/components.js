const components = {
    Icon: require('../components/icon/index.vue'),
    DataTable: require('../components/data-table/index.vue'),
    DetailPage: require('../components/detail-page/index.vue'),
    Quality: require('../components/quality.vue'),
    MButton: require('../components/m-button.vue'),
}

export default function install(Vue) {
    Object.keys(components).forEach(key => {
        Vue.component(key, components[key])
    })
}
