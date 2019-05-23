export default {
    namespaced: true,
    state: {
        downloaded: [],
        downloading: []
    },
    mutations: {
        update(state, val) {
            for (let i in val) {
                state[i] = val[i]
            }
        },
        addDownloading(state, song) {
            state.downloading.push(song)
        },
        setDownloadingItem(state, {index, downloadItem}) {
            state.downloading[index].downloadItem = downloadItem
        },
        updateDownloadingProgress(state, {index, progress}) {
            state.downloading[index].progress = progress
        },
        change2Downloaded(state, {index, downloadItem}) {
            state.downloaded.push({
                ...state.downloading[index],
                downloadItem
            })
            localStorage.setItem('downloaded', JSON.stringify(state.downloaded))
            state.downloading.splice(index, 1)
        },
        removeFromDownloaded(state, index) {
            state.downloaded.splice(index, 1)
        },
        removeFromDownloading(state, index) {
            Vue.$ipc.send('download-cancel', state.downloading[index].id)
            state.downloading.splice(index, 1)
        },
    },
    actions: {
        init({commit, getters}) {
            const downloaded = JSON.parse(localStorage.getItem('downloaded') || '[]')
            commit('update', {
                downloaded
            })
            Vue.$ipc.on('download-onStarted', (event, args) => {
                commit('setDownloadingItem', {
                    index: getters.downloadingIndexMap[args.id],
                    downloadItem: args.downloadItem
                })
            })
            Vue.$ipc.on('download-onProgress', (event, args) => {
                commit('updateDownloadingProgress', {
                    index: getters.downloadingIndexMap[args.id],
                    progress: args.progress
                })
            })
            Vue.$ipc.on('download-success', (event, args) => {
                commit('change2Downloaded', {
                    index: getters.downloadingIndexMap[args.id],
                    downloadItem: args.downloadItem
                })
            })
        },
        async download({commit, getters}, song) {
            if (song.cp) {
                Vue.$message.warning('歌曲无法下载')
                return
            }
            const id = `${song.vendor}_${song.songId}`
            if (Object.keys(getters.downloadingIndexMap).includes(id) || Object.keys(getters.downloadedIndexMap).includes(id)) {
                Vue.$message.warning('下载记录中已存在')
                return
            }
            const data = await Vue.$musicApi.getSongUrl(song.vendor, song.songId)
            if (!data.data.url.startsWith('http')) {
                data.data.url = 'https:' + data.data.url
            }
            if (data.status) {
                Vue.$ipc.send('download-btn', {
                    url: data.data.url,
                    filename: song.name + '.mp3',
                    id
                })
                commit('addDownloading', {
                    ...song,
                    id,
                    progress: 0
                })
                Vue.$notify({
                    message: '已加入下载列表',
                    type: 'success',
                    duration: 1000
                })
            } else {
                console.warn(data)
                Vue.$message.warning(data.msg)
            }
        }
    },
    getters: {
        downloadingIndexMap(state) {
            const obj = {}
            state.downloading.forEach((song, index) => {
                obj[song.id] = index
            })
            return obj
        },
        downloadedIndexMap(state) {
            const obj = {}
            state.downloaded.forEach((song, index) => {
                obj[song.id] = index
            })
            return obj
        }
    }
}
