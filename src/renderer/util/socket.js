import io from "socket.io-client"
import eventBus from '../eventBus/chat'
import config from '../../../config'

export default {
    socket: null,
    connect() {
        if (this.socket) {
            this.disconnect()
        }
        let platform
        switch (process.platform) {
            case 'darwin':
                platform = 'osx'
                break
            case 'win32':
                platform = 'windows'
                break
            default:
                platform = 'linux'
                break
        }
        this.socket = io(config.socket, {
            transportOptions: {
                polling: {
                    extraHeaders: {
                        accesstoken: localStorage.token || '',
                        platform
                    }
                }
            }
        })
        this.initEvent()
    },
    disconnect() {
        this.socket.close()
    },
    logout() {
        setTimeout(() => {
            this.connect()
        }, 500)
    },
    initEvent() {
        const store = Vue.$store
        this.socket.on('error', (error) => {
            console.warn(error)
        })
        const isSelf = (user) => {
            return store.dispatch('socket/isSelf', user)
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
            // if (!isSelf(user)) {
            //     store.commit('socket/addChatHistory', {
            //         type: 'system',
            //         message: `${user.nickname}上线了`
            //     })
            // }
        })
        // 有人下线
        this.socket.on('someone leave', user => {
            console.log('someone leave', user)
            // store.commit('socket/addChatHistory', {
            //     type: 'system',
            //     message: `${user.nickname}下线了`
            // })
        })
        this.socket.on('broadcast', packet => {
            console.log('broadcast', JSON.stringify(packet))
            const canParseTypes = ['broadcast', 'share']
            if (canParseTypes.includes(packet.type)) {
                store.dispatch('socket/addChatHistory', packet)
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