export default {
    namespaced: true,
    state: {
        info: null,
        setting: localStorage.getItem('userSetting') ? JSON.parse(localStorage.getItem('userSetting')) : {
            linuxAutoUpdate: false, // linux下自动更新
            macStatusBar: true, // mac状态栏
        }
    },
    mutations: {
        update(state, val) {
            state.info = val
            // 初始化歌单
            Vue.$store.dispatch('playlist/init')
        },
        updateSetting(state, val) {
            for (let i in val) {
                state.setting[i] = val[i]
            }
            localStorage.setItem('userSetting', JSON.stringify(state.setting))
        }
    },
    actions: {
        async init({commit}) {
            const data = await Vue.$http.get('/user')
            Vue.$socket.connect() // 连接 socket
            commit('update', data)
        },
        logout({commit}) {
            commit('update', null)
            Vue.$store.commit('token/clear')
            Vue.$message.success('退出成功')
        }
    }
}
