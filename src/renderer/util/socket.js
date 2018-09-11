import config from "../../../config"
import io from "socket.io-client"

export default {
    socket: null,
    connect() {
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
            Vue.$store.commit('socket/update', {
                onlineTotal: total
            })
        })
    }
}