export default {
    list: Array(22).fill(null),
    renderCache: null,
    async getRank(params) {
        const data = await Vue.$http.get('/music/netease/rank', {
            params
        })
        return data.map(single => {
            single.list = single.list.map(item => {
                item.vendor = 'netease'
                item.songId = item.id
                return item
            })
            return single
        })
    }
}