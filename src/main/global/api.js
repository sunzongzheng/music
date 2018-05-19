import api from 'music-api'

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
                            // 检查是否已存在同名 同歌手 同专辑 则跳过
                            if (result.filter(item => {
                                // 首先判断歌手是不是全等 此处歌手可能有多个
                                let art_same = true
                                item.artists.every((item, index) => {
                                    if (!cur.artists[index] || item.name !== cur.artists[index].name) {
                                        art_same = false
                                        return false
                                    }
                                    return true
                                })
                                return item.name === cur.name && art_same && item.album.name === cur.album.name
                            }).length) {
                                continue
                            } else {
                                result.push({
                                    ...cur,
                                    source: j
                                })
                            }
                        }
                    }
                }
                return {
                    status: true,
                    data: result
                }
            } else {
                return data
            }
        } catch (e) {
            console.warn(e)
            return {
                status: false,
                msg: e.msg || '搜索失败，请重试',
                log: e
            }
        }
    },
    async getTopList(id) {
        const data = await api.getTopList(id)
        if (data.status) {
            for (let item of data.data.list) {
                item.source = 'netease'
            }
        }
        return data
    }
}