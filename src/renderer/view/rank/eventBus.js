export default {
    list: Array(22).fill(null),
    renderCache: null,
    async getRank(vendor, params) {
        const data = await Vue.$http.get(`/music/${vendor}/rank`, {
            params
        })
        return data.map(single => {
            single.list = single.list.map(item => {
                item.vendor = vendor
                item.songId = item.id
                return item
            })
            return single
        })
    }
}