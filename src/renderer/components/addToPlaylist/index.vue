<template>
    <div :class="s.app">
        <el-popover :placement="placement" trigger="click" ref="playlist" v-model="show">
            <ul :class="s.playlist" v-if="playlist">
                <li v-for="item in playlist" @click="collect(item.id)">{{item.name}}</li>
            </ul>
            <template v-if="!playlist || !playlist.length">暂无歌单</template>
        </el-popover>
        <Icon :type="icon" :class="s.icon" v-popover:playlist></Icon>
    </div>
</template>
<script>
    import {mapState} from 'vuex'

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
            ...mapState('api', ['play'])
        },
        methods: {
            async collect(id) {
                this.show = false
                await this.$http.post(`/playlist/${id}`, {
                    id: this.info.songId,
                    vendor: this.info.vendor,
                    commentId: this.info.commentId,
                    name: this.info.name,
                    album: this.info.album,
                    artists: this.info.artists,
                    cp: this.info.cp
                })
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

    .playlist {
        list-style: none;
        li {
            padding: 4px 8px;
            cursor: pointer;
            &:hover {
                background-color: rgba(245, 245, 245, 0.49)
            }
        }
    }
</style>