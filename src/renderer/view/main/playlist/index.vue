<template>
    <div :class="s.app">
        <a :class="s.title">{{name}}</a>
        <el-table :data="list" :class="s.table" v-loading="loading" :row-class-name="rowClassName">
            <el-table-column label="歌曲" :width="220">
                <template scope="scope">
                    <div :class="s.nameItem">
                        <div :class="s.songName" :title="scope.row.name">{{scope.row.name}}</div>
                        <div :class="s.songControl">
                            <Icon type="item-play" @click.native="doPlay(scope.row)" v-if="!scope.row.cp"></Icon>
                            <add-to-playlist :info="scope.row"></add-to-playlist>
                            <Icon type="huishouzhan" @click.native="removeFromPlaylist(scope.row)"></Icon>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="歌手">
                <template scope="scope">
                    {{scope.row.artists[0].name}}
                </template>
            </el-table-column>
            <el-table-column prop="album.name" label="专辑"></el-table-column>
            <el-table-column label="来源">
                <template scope="scope">
                    {{scope.row.vendor | source}}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
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
            id() {
                return parseInt(this.$route.params.id)
            },
            name() {
                const arr = this.playlist.filter(item => item.id === this.id)
                return arr.length ? arr[0].name : ''
            }
        },
        methods: {
            ...mapActions('api', ['play']),
            async getSong(id = this.id) {
                this.loading = true
                try {
                    this.list = await this.$http.get(`playlist/${id}`)
                } catch (e) {
                    console.warn(e)
                    this.$router.push('/')
                }
                this.loading = false
            },
            async removeFromPlaylist(item) {
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
                this.$store.commit('c_playlist/update', list)
                this.play(item)
            },
            rowClassName({row, rowIndex}) {
                const rs = [
                    this.s.row
                ]
                if (row.cp) {
                    rs.push(this.s.disabled)
                }
                return rs.join(' ')
            }
        },
        created() {
            this.getSong()
        },
        beforeRouteUpdate(to, from, next) {
            this.getSong(to.params.id)
            next()
        }
    }
</script>
<style lang="scss" module="s">
    .app {
        padding: 0 16px;
        .title {
            display: flex;
            width: 100%;
            font-size: 20px;
            color: #191919;
            height: 46px;
            padding-top: 16px;
            align-items: center;
            .edit {
                font-size: 16px;
                margin-left: 8px;
                color: #777;
            }
        }
        .table {
            width: 100%;
            height: calc(100% - 46px);
            margin-top: 20px;
            overflow: auto;
            .row.disabled {
                opacity: .6;
            }
            .nameItem {
                display: flex;
                &:hover {
                    .songControl {
                        display: inline-flex;
                        align-items: center;
                    }
                }
                .songName {
                    width: 160px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .songControl {
                    display: none;
                    width: 60px;
                    svg {
                        margin-left: 6px;
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>