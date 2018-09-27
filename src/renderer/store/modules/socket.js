export default {
    namespaced: true,
    state: {
        onlineTotal: 0, // 实时在线人数
        onlineUsers: [],
        chatHistory: [], // 聊天记录
    },
    mutations: {
        update(state, val) {
            for (let i in val) {
                state[i] = val[i]
            }
        },
        addChatHistory(state, val) {
            state.chatHistory.push(val)
        }
    }
}