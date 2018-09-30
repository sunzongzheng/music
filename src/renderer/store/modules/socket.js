import moment from 'moment'
import eventBus from '../../eventBus/chat'
import alertResource from '../../assets/alert.mp3'

export default {
    namespaced: true,
    state: {
        onlineTotal: 0, // 实时在线人数
        onlineUsers: [],
        chatHistory: [], // 聊天记录
        readIndex: 0, // 已阅读到的index
    },
    mutations: {
        update(state, val) {
            for (let i in val) {
                state[i] = val[i]
            }
        },
        addChatHistory(state, val) {
            state.chatHistory.push(val)
            if (val.type === 'system') {
                state.readIndex++
            } else if (Vue.$store.state.user.setting.messageAlert) {
                const alert = document.createElement('audio')
                alert.src = alertResource
                alert.autoplay = true
            }
            if (Vue.$router.history.current.name === 'chat') {
                state.readIndex = state.chatHistory.length
                eventBus.$emit('scrollBottom')
            }
        }
    },
    actions: {
        async initChatHistory({state, commit}) {
            try {
                const data = await Vue.$http.get('/chat-history', {
                    params: {
                        start_dt: moment().subtract(1, 'month').format('YYYY-MM-DD 00:00:00')
                    }
                })
                const chatHistory = data.concat(state.chatHistory)
                commit('update', {
                    chatHistory,
                    readIndex: chatHistory.length
                })
            } catch (e) {
            }
        }
    },
    getters: {
        hasUnreadMsg(state) {
            return state.readIndex < state.chatHistory.length
        }
    }
}