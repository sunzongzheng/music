import { remote } from 'electron'
import uuid from 'uuid/v1'

const fs = remote.require('fs')
const path = remote.require('path')
const mm = require('music-metadata/lib/index')

export default {
    namespaced: true,
    state: {
        songs: [],
    },
    mutations: {
        clear(state) {
            state.songs = []
        },
        add(state, song) {
            state.songs.push(song)
        },
    },
    actions: {
        async refresh({ commit }) {
            commit('clear')
            const folders = Vue.$store.state.user.setting.localSongsFolders
            for (let folder of folders) {
                try {
                    const dirs = fs.readdirSync(folder)
                    for (let item of dirs) {
                        const pathname = path.join(folder, item)
                        const stat = fs.statSync(pathname)
                        if (stat.isFile()) {
                            if (item.endsWith('.mp3') || item.endsWith('flac')) {
                                const metadata = await mm.parseFile(pathname)
                                if (metadata.common.title === '可不可以') {
                                    console.log(metadata)
                                }
                                const bitrate = metadata.format.bitrate || 128000
                                commit('add', {
                                    name: item.substring(0, item.lastIndexOf('.')),
                                    album: {
                                        name: metadata.common.album,
                                    },
                                    artists: metadata.common.artists ? metadata.common.artists.map(item => {
                                        return {
                                            name: item,
                                        }
                                    }) : [],
                                    cp: false,
                                    quality: {
                                        192: (bitrate / 1000) === 192,
                                        320: (bitrate / 1000) === 320,
                                        999: (bitrate / 1000) === 999,
                                    },
                                    songId: uuid(),
                                    bitrate,
                                    duration: parseInt(metadata.format.duration),
                                    fullpath: pathname,
                                    folder,
                                    size: stat.size,
                                })
                            }
                        }
                    }
                } catch (e) {
                    console.warn(e)
                }
            }
        },
    },
}
