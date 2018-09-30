export default {
    namespaced: true,
    state: {
        info: null,
        setting: localStorage.getItem('userSetting') ? JSON.parse(localStorage.getItem('userSetting')) : {
            linuxAutoUpdate: false, // linux下自动更新
            macStatusBar: true, // mac状态栏
            messageAlert: false, // 消息提示音
        }
    },
    mutations: {
        update(state, val) {
            state.info = val
            if (val) {
                // 初始化
                Vue.$store.dispatch('playlist/init')
                Vue.$store.dispatch('socket/initChatHistory')
            } else {
                Vue.$store.commit('playlist/update', [])
                Vue.$store.commit('socket/update', {
                    chatHistory: []
                })
                Vue.$socket.logout()
                if (Vue.$router.history.current.name === 'chat') {
                    Vue.$router.push('/')
                }
            }
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
            commit('update', data)
        },
        logout({commit}) {
            commit('update', null)
            Vue.$store.commit('token/clear')
            Vue.$message.success('退出成功')
        }
    }
}
