import musicApiContructor from '@suen/music-api/dist/app.electron'
import { remote } from 'electron'

const api = musicApiContructor(remote.getGlobal('nodeAdapter'))

export default {
    ...api,
    async searchSong(key) {
        try {
            let data = await api.searchSong(key)
            if (data.status) {
                data = data.data
                // 为了保留 每个平台搜索结果 的排序权重  此处先找出最大长度
                let maxLength = 0
                for (let i in data) {
                    const len = data[i].songs.length
                    if (len > maxLength) {
                        maxLength = len
                    }
                }
                const result = []
                for (let i = 0; i < maxLength; i++) {
                    for (let j in data) {
                        const cur = data[j].songs[i]
                        // 如果存在
                        if (typeof cur !== 'undefined') {
                            result.push({
                                ...cur,
                                songId: cur.id,
                                vendor: j,
                            })
                        }
                    }
                }
                return {
                    status: true,
                    data: result,
                }
            } else {
                return data
            }
        } catch (e) {
            console.warn(e)
            return {
                status: false,
                msg: e.msg || '搜索失败，请重试',
                log: e,
            }
        }
    },
    async getTopList(id) {
        const data = await api.getTopList(id)
        if (data.status) {
            for (let item of data.data.list) {
                item.vendor = 'netease'
                item.songId = item.id
            }
        }
        return data
    },
}