import io from "socket.io-client"

export default {
    socket: null,
    connect() {
        if(this.socket) {
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
        this.socket.on('error', (error) => {
            console.warn(error)
        })
        this.socket.on('online total', total => {
            console.log('online total: ', total)
            Vue.$store.commit('socket/update', {
                onlineTotal: total
            })
        })
        this.socket.on('online users', users => {
            console.log('online users', users)
        })
        this.socket.on('someone join', user => {
            console.log('someone join', user)
        })
        this.socket.on('someone leave', user => {
            console.log('someone leave', user)
        })
        this.socket.on('broadcast', packet => {
            console.log('broadcast', packet)
        })
    }
}