<template>
    <div :class="s.app">
        <el-popover :placement="placement" trigger="click" ref="playlist" v-model="show">
            <template v-if="(userInfo && playlist.length) || offline_playlist.length">
                <template v-if="userInfo && playlist.length">
                    <p :class="s.title">云歌单</p>
                    <ul :class="s.playlist">
                        <li v-for="item in playlist" @click="collect(item.id)">{{item.name}}</li>
                    </ul>
                </template>
                <template v-if="offline_playlist.length">
                    <p :class="s.title">离线歌单</p>
                    <ul :class="s.playlist">
                        <li v-for="item in offline_playlist" @click="collectOffline(item.id)">{{item.name}}</li>
                    </ul>
                </template>
            </template>
            <template v-else>暂无歌单</template>
        </el-popover>
        <Icon :type="icon" :class="s.icon" v-popover:playlist></Icon>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import uuid from 'uuid/v1'

    export default {
        props: {
            placement: {
                type: String,
                default: 'top'
            },
            icon: {
                type: String,
                default: 'item-add'
            },
            info: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                show: false
            }
        },
        computed: {
            ...mapState('playlist', ['playlist']),
            ...mapState('offline-playlist', ['offline_playlist']),
            ...mapState('user', {
                userInfo: 'info'
            }),
            ...mapState('api', ['play'])
        },
        methods: {
            async collect(id) {
                this.show = false
                await this.$http.post(`/playlist/${id}`, {
                    id: this.info.songId,
                    vendor: this.info.vendor,
                    name: this.info.name,
                    album: this.info.album,
                    artists: this.info.artists,
                    cp: this.info.cp
                })
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
            },
            collectOffline(id) {
                const storage_name = `offline_playlist_${id}_song`
                const list = JSON.parse(localStorage.getItem(storage_name)) || []
                if (list.filter(item => item.songId === this.info.songId && item.vendor === this.info.vendor).length) {
                    this.show = false
                    this.$message.warning('歌曲已存在！')
                    return
                }
                list.push(this.info)
                localStorage.setItem(storage_name, JSON.stringify(list))
                this.show = false
                this.$message({
                    message: '添加成功',
                    type: 'success'
                })
            }
        }
    }
</script>
<style lang="scss" module="s">
    .app {
        display: inline-flex;
        align-items: center;
    }

    .title {
        font-size: 12px;
        color: #8F8F8F;
        margin: 0;
    }

    .playlist {
        list-style: none;
        margin-bottom: 4px;
        li {
            padding: 4px 8px;
            cursor: pointer;
            &:hover {
                background-color: rgba(245, 245, 245, 0.49)
            }
        }
    }
</style>