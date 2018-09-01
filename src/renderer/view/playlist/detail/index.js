import {mapState, mapActions} from 'vuex'

export default {
    name: 'playlist',
    data() {
        return {
            list: [],
            loading: false
        }
    },
    computed: {
        ...mapState('playlist', ['playlist']),
        ...mapState('offline-playlist', ['offline_playlist']),
        id() {
            const id = this.$route.params.id
            return isNaN(Number(id)) ? id : Number(id)
        },
        info() {
            return (this.offline ? this.offline_playlist : this.playlist).filter(item => item.id === this.id)[0] || {}
        },
        offline() {
            return this.$route.query.offline
        },
    },
    methods: {
        ...mapActions('play', ['play']),
        getOfflineStoreName(id = this.id) {
            return `offline_playlist_${id}_song`
        },
        async getSong(id = this.id) {
            if (this.offline) {
                this.list = (JSON.parse(localStorage.getItem(this.getOfflineStoreName(id))) || []).map(item => {
                    return {
                        ...item,
                        songId: item.commentId || item.songId
                    }
                })
                this.updateSongsInfo()
                return
            }
            this.loading = true
            try {
                this.list = await this.$http.get(`playlist/${id}`)
                this.updateSongsInfo()
            } catch (e) {
                console.warn(e)
                this.$router.push('/')
            }
            this.loading = false
        },
        async removeFromPlaylist(item) {
            if (this.offline) {
                const list = JSON.parse(localStorage.getItem(this.getOfflineStoreName())) || []
                for (let i in list) {
                    if (list[i].songId === item.songId && list[i].vendor === item.vendor) {
                        list.splice(i, 1)
                        break
                    }
                }
                localStorage.setItem(this.getOfflineStoreName(), JSON.stringify(list))
                this.getSong()
                return
            }
            await this.$http.delete(`playlist/${this.id}`, {
                params: {
                    id: item.id
                }
            })
            this.getSong()
        },
        doPlay(item) {
            let list = []
            this.list.forEach(item => {
                list.push(item)
            })
            this.play({
                info: item,
                playlist: list
            })
        },
        rowClassName({row, rowIndex}) {
            const rs = [
                this.s.row
            ]
            if (row.cp) {
                rs.push(this.s.disabled)
            }
            return rs.join(' ')
        },
        // 更新歌曲信息
        async updateSongsInfo() {
            const list = {
                netease: [],
                qq: [],
                xiami: []
            }
            const detail = {
                netease: {},
                qq: {},
                xiami: {}
            }
            this.list.forEach(item => {
                list[item.vendor].push(item)
            })
            const vendors = ['netease', 'qq', 'xiami']
            for (let vendor of vendors) {
                const ids = list[vendor].map(item => item.commentId)
                if (ids.length) {
                    const data = await this.$musicApi.getBatchSongDetail(vendor, ids)
                    if (data.status) {
                        data.data.forEach(item => {
                            detail[vendor][item.id] = item
                        })
                    }
                }
            }
            for (let item of this.list) {
                const info = detail[item.vendor][item.commentId]
                if (info) {
                    item.cp = info.cp
                    item.name = info.name
                    item.commentId = info.id
                    item.album = info.album
                    item.artists = info.artists
                } else {
                    // 音乐平台删歌以后这首歌就不能听了
                    // 如果是QQ音乐 有可能改了ID 调用单个获取信息接口验证
                    if (item.vendor === 'qq') {
                        const singleInfo = await this.$musicApi.getSongDetail(item.vendor, item.songId)
                        if (singleInfo.status) {
                            console.log('歌曲ID变了：', item)
                            item.cp = singleInfo.data.cp
                            item.name = singleInfo.data.name
                            item.commentId = singleInfo.data.id
                            item.album = singleInfo.data.album
                            item.artists = singleInfo.data.artists
                        } else {
                            console.log('歌曲被删：', item)
                            item.cp = true
                        }
                    } else {
                        console.log('歌曲被删：', item)
                        item.cp = true
                    }
                }
                return item
            }
        }
    },
    created() {
        this.getSong()
    },
    beforeRouteUpdate(to, from, next) {
        next()
        this.getSong(to.params.id)
    }
}