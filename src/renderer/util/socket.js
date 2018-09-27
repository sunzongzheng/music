import io from "socket.io-client"
import eventBus from '../eventBus/chat'

export default {
    socket: null,
    connect() {
        if (this.socket) {
            this.disconnect()
        }
        this.socket = io('https://socket.zzsun.cc', {
            transportOptions: {
                polling: {
                    extraHeaders: {
                        accesstoken: localStorage.token || ''
                    }
                }
            }
        })
        this.initEvent()
    },
    disconnect() {
        this.socket.close()
    },
    initEvent() {
        const store = Vue.$store
        this.socket.on('error', (error) => {
            console.warn(error)
        })
        const isSelf = (user) => {
            const userInfo = store.state.user.info
            if (!userInfo) return true
            return user.nickname === userInfo.nickname && user.avatar === userInfo.avatar
        }
        // 在线总人数
        this.socket.on('online total', total => {
            console.log('online total: ', total)
            store.commit('socket/update', {
                onlineTotal: total
            })
        })
        // 在线登录用户
        this.socket.on('online users', users => {
            console.log('online users', users)
            store.commit('socket/update', {
                onlineUsers: users
            })
        })
        // 有人上线
        this.socket.on('someone join', user => {
            console.log('someone join', user)
            if (!isSelf(user)) {
                store.commit('socket/addChatHistory', {
                    type: 'system',
                    message: `${user.nickname}上线了`
                })
            }
        })
        // 有人下线
        this.socket.on('someone leave', user => {
            console.log('someone leave', user)
            store.commit('socket/addChatHistory', {
                type: 'system',
                message: `${user.nickname}下线了`
            })
        })
        this.socket.on('broadcast', packet => {
            console.log('broadcast', JSON.stringify(packet))
            const canParseTypes = ['broadcast', 'share']
            if (canParseTypes.includes(packet.type)) {
                store.commit('socket/addChatHistory', packet)
                if (isSelf(packet.userInfo)) {
                    eventBus.$emit('scrollBottom')
                }
            }
        })
    },
    emit() {
        this.socket.emit(...arguments)
    },
    on() {
        this.socket.on(...arguments)
    }
}