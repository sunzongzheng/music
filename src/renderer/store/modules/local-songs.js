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

            const walk = async folder => {
                const dirs = fs.readdirSync(folder)
                for (let filename of dirs) {
                    const filepath = path.join(folder, filename)
                    const stat = fs.statSync(filepath)
                    if (stat.isFile()) {
                        if (
                            filename.endsWith('.mp3') ||
                            filename.endsWith('flac')
                        ) {
                            const metadata = await mm.parseFile(filepath)
                            const bitrate = metadata.format.bitrate || 128000
                            commit('add', {
                                name: filename.substring(
                                    0,
                                    filename.lastIndexOf('.')
                                ),
                                album: {
                                    name: metadata.common.album,
                                },
                                artists: metadata.common.artists
                                    ? metadata.common.artists.map(name => {
                                          return {
                                              name,
                                          }
                                      })
                                    : [],
                                cp: false,
                                quality: {
                                    192: bitrate / 1000 === 192,
                                    320: bitrate / 1000 === 320,
                                    999: bitrate / 1000 === 999,
                                },
                                songId: uuid(),
                                bitrate,
                                duration: parseInt(metadata.format.duration),
                                fullpath: filepath,
                                folder,
                                size: stat.size,
                            })
                        }
                    } else if (stat.isDirectory()) {
                        await walk(filepath)
                    }
                }
            }
            for (let folder of folders) {
                try {
                    await walk(folder)
                } catch (e) {
                    console.warn(e)
                }
            }
        },
    },
}
