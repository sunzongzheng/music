<template>
    <div :class="s.app">
        <el-popover :placement="placement" trigger="click" ref="playlist" v-model="show">
            <template v-if="(userInfo && playlist.length) || offline_playlist.length">
                <template v-if="userInfo && playlist.length">
                    <p :class="s.title">云歌单</p>
                    <ul :class="s.playlist">
                        <li v-for="item in playlist" @click="_collect(item.id)">{{item.name}}</li>
                    </ul>
                </template>
                <template v-if="offline_playlist.length">
                    <p :class="s.title">离线歌单</p>
                    <ul :class="s.playlist">
                        <li v-for="item in offline_playlist" @click="_collectOffline(item.id)">{{item.name}}</li>
                    </ul>
                </template>
            </template>
            <template v-else>暂无歌单</template>
        </el-popover>
        <Icon :type="icon" :class="s.icon" v-popover:playlist></Icon>
    </div>
</template>
<script>
    import {mapState, mapActions} from 'vuex'

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
            ...mapState('play', ['play'])
        },
        methods: {
            ...mapActions('playlist', ['collect']),
            ...mapActions('offline-playlist', {
                collectOffline: 'collect'
            }),
            async _collect(id) {
                this.show = false
                this.collect({
                    id,
                    info: {
                        ...this.info,
                        id: this.info.songId
                    }
                })
            },
            _collectOffline(id) {
                this.collectOffline({
                    id,
                    info: this.info
                })
                this.show = false
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