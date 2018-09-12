import config from "../../../config"
import io from "socket.io-client"

export default {
    socket: null,
    connect() {
        if(this.socket) {
            this.disconnect()
        }
        this.socket = io(config.api, {
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
            console.log(users)
        })
        this.socket.on('broadcast', packet => {
            console.log(packet)
        })
    }
}