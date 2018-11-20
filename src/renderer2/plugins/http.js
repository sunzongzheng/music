import Fly from 'flyio/dist/npm/fly'

export default function(Vue) {
    const fly = new Fly()
    fly.config.baseURL = Vue.$config.api
    fly.interceptors.request.use(request => {
        const token = localStorage.token
        if (token) {
            request.headers.accesstoken = JSON.parse(token)
        }
        return request
    })
    fly.interceptors.response.use(
        response => response.data,
        e => {
            console.warn(e)
            if (e.response) {
                const data = e.response.data
                if (e.response.status === 401) {
                    Vue.$store.dispatch('user/logout')
                } else if (e.response.status === 502) {
                    Vue.$message.warning('服务端可能正在发版本~请稍后重试')
                } else if (data.msg) {
                    Vue.$message.warning(data.msg)
                }
            } else {
                Vue.$message.warning('请检查网络连接')
            }
            return Promise.reject(e)
        }
    )
    Vue.$http = Vue.prototype.$http = fly
}
