<template>
    <div :class="s.import">
        <el-breadcrumb style="margin-top: 8px;">
            <el-breadcrumb-item :to="{ name: 'playlist', params: { id: albumId }, query: $route.query }">{{name}}</el-breadcrumb-item>
            <el-breadcrumb-item>导入歌曲</el-breadcrumb-item>
        </el-breadcrumb>
        <div :class="s.main">
            <el-radio v-for="(item,key) in vendors"
                      :key="key"
                      v-model="vendor"
                      :label="key"
            >
                {{item.text}}
            </el-radio>
            <el-input placeholder="请输入歌单ID"
                      v-model="id"
                      size="small"
                      style="margin-top: 24px;"
                      clearable
            >
                <template slot="prepend">
                    <template v-if="vendor === 'netease'">
                        http://music.163.com/#/my/m/music/playlist?id=
                    </template>
                    <template v-else-if="vendor === 'qq'">
                        https://y.qq.com/n/yqq/playlist/
                    </template>
                    <template v-else="vendor === 'xiami'">
                        https://www.xiami.com/collect/
                    </template>
                </template>
                <template slot="append" v-if="vendor === 'qq'">
                    .html
                </template>
            </el-input>
            <p :class="s.help">
                登录网页版<a @click="openExternal(false)">{{chosen.text}}</a>后，<a @click="openExternal">点此进入歌单</a>，从url中找到歌单ID
            </p>
            <el-button style="margin-top: 32px"
                       size="small"
                       type="primary"
                       :disabled="!id"
                       @click="getAlbumSongs"
                       :loading="loading.getAlbumSongs"
            >识别歌单
            </el-button>
            <template v-if="album">
                <el-button style="margin-top: 32px"
                           size="small"
                           type="primary"
                           @click="importSongs"
                           :loading="loading.importSongs"
                >立即导入
                </el-button>
                <v-table :album="album"
                         style="margin-top: 24px;"
                ></v-table>
            </template>
        </div>
    </div>
</template>
<script>
    import {shell} from 'electron'
    import vTable from './table.vue'
    import {mapState, mapActions} from 'vuex'

    export default {
        components: {
            vTable
        },
        data() {
            return {
                vendor: 'netease',
                id: '',
                album: null,
                loading: {
                    getAlbumSongs: false,
                    importSongs: false
                },
                vendors: {
                    netease: {
                        text: '网易云音乐',
                        home: 'http://music.163.com/',
                        album: 'http://music.163.com/#/my/'
                    },
                    qq: {
                        text: 'QQ音乐',
                        home: 'https://y.qq.com/',
                        album: 'https://y.qq.com/portal/profile.html#sub=other&tab=create&'
                    },
                    xiami: {
                        text: '虾米音乐',
                        home: 'https://www.xiami.com/',
                        album: 'https://www.xiami.com/space/collect'
                    }
                }
            }
        },
        computed: {
            ...mapState('playlist', ['playlist']),
            ...mapState('offline-playlist', ['offline_playlist']),
            albumId() {
                const id = this.$route.params.id
                return isNaN(Number(id)) ? id : Number(id)
            },
            chosen() {
                return this.vendors[this.vendor]
            },
            offline() {
                return this.$route.query.offline
            },
            name() {
                const arr = (this.offline ? this.offline_playlist : this.playlist).filter(item => item.id === this.albumId)
                return arr.length ? arr[0].name : ''
            },
        },
        watch: {
            vendor() {
                this.album = null
            }
        },
        methods: {
            ...mapActions('offline-playlist', ['batchCollect']),
            openExternal(isAlbum = true) {
                shell.openExternal(isAlbum ? this.chosen.album : this.chosen.home)
            },
            // 获取歌单歌曲
            async getAlbumSongs() {
                this.loading.getAlbumSongs = true
                try {
                    const data = await Vue.$musicApi.getPlaylistDetail(this.vendor, this.id)
                    if (data.status) {
                        this.album = {}
                        Vue.set(this.album, 'detail', data.data.detail)
                        Vue.set(this.album, 'songs', data.data.songs)
                        this.album.songs = this.album.songs.map(item => {
                            return {
                                ...item,
                                songId: item.id,
                                vendor: this.vendor,
                                status: -1
                            }
                        })
                    } else {
                        this.$message.warning('无法识别歌单')
                    }
                } catch (e) {
                    console.warn(e)
                    e.msg && this.$message.warning(e.msg)
                }
                this.loading.getAlbumSongs = false
            },
            // 导入歌曲
            async importSongs() {
                this.loading.importSongs = true
                try {
                    let failedList = []
                    if (this.offline) {
                        failedList = await this.batchCollect({
                            id: this.albumId,
                            songs: this.album.songs
                        })
                    } else {
                        const data = await Vue.$http.post(`/playlist/${this.albumId}/batch2`, {
                            collects: this.album.songs.map(item => {
                                return {
                                    id: item.id,
                                    vendor: item.vendor
                                }
                            })
                        })
                        failedList = data.failedList
                    }
                    this.album.songs = this.album.songs.map(song => {
                        const cur = failedList.find(item => song.id === item.id)
                        if (cur) {
                            song.status = 0
                            song.msg = cur.msg
                        } else {
                            song.status = 1
                        }
                        return song
                    })
                } catch (e) {
                    console.warn(e)
                    e.msg && this.$message.warning(e.msg)
                }
                this.loading.importSongs = false
            }
        }
    }
</script>
<style lang="scss" module="s">
    .import {
        padding: 16px 20px 0;
        .main {
            margin-top: 24px;
        }
        .help {
            color: $color-sub;
            font-size: 12px;
            margin-top: 8px;
            a {
                color: $color-primary;
                cursor: pointer;
            }
        }
    }
</style>