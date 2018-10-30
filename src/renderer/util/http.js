import config from '../../../config'
import axios from 'axios'
import Vue from 'vue'

const instance = axios.create({
    baseURL: config.api,
    timeout: 30000,
})
instance.interceptors.request.use(function(config) {
    const token = localStorage.token
    if (token) {
        config.headers.accesstoken = token
    }
    return config
}, function(error) {
    return Promise.reject(error)
})
instance.interceptors.response.use(
    response => response.data,
    e => {
        console.warn(e)
        if (e.response) {
            const data = e.response.data
            if (e.response.status === 401) {
                localStorage.removeItem('token')
                Vue.$store.dispatch('user/logout', false)
            } else if (e.response.status === 502) {
                Vue.$message.warning('服务端可能正在发版本~请稍后重试')
            } else if (data.msg) {
                Vue.$message.warning(data.msg)
            }
        } else {
            Vue.$message.warning('请检查网络连接')
        }
        return Promise.reject(e)
    })

export default instance