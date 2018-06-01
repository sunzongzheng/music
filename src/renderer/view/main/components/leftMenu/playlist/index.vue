<template>
    <div :class="s.playlist">
        <div :class="s.titleArea">
            <span :class="s.title">创建的歌单</span>
            <Icon type="playlist-add" :class="s.icon" @click.native="addPlaylist" v-if="info"></Icon>
        </div>
        <ul :class="s.list">
            <li v-show="add.status">
                <input v-model="add.name" ref="input" style="width: 135px;" @blur="save"/>
            </li>
            <v-item v-for="(item,index) in playlist" :info="item" :key="index"></v-item>
        </ul>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import vItem from './item.vue'

    export default {
        components: {vItem},
        data() {
            return {
                add: {
                    status: false,
                    name: ''
                }
            }
        },
        computed: {
            ...mapState('user', ['info']),
            ...mapState('playlist', ['playlist'])
        },
        methods: {
            addPlaylist() {
                this.add = {
                    status: true,
                    name: this.getName()
                }
                this.$nextTick(() => {
                    this.$refs.input.focus()
                })
            },
            getName() {
                let num = 1
                let name = '新建歌单'
                while (num) {
                    if (this.playlist.filter(item => item.name === (name + num)).length) {
                        num++
                    } else {
                        name += num
                        num = 0
                    }
                }
                return name
            },
            async save() {
                if (!this.add.name) {
                    this.add.status = false
                    return
                }
                // if (this.playlist.filter(item => item.name === this.add.name).length) {
                //   this.$message({
                //     message: '不允许创建同名歌单',
                //     type: 'warning'
                //   })
                //   this.add.status = false
                //   return
                // }
                await this.$store.dispatch('playlist/add', this.add.name)
                this.$store.dispatch('playlist/init')
                this.add.status = false
            }
        }
    }
</script>
<style lang="scss" module="s">
    .playlist {
        width: 100%;
        .titleArea {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .title {
                font-size: 12px;
                color: #8F8F8F;
            }
            .icon {
                cursor: pointer;
            }
        }
        .list {
            margin-top: 8px;
            padding-left: 12px;
            font-size: 13px;
            color: #333;
            list-style: none;
            input {
                height: 20px;
                padding: 0 4px;
                &:focus {
                    border: none;
                }
            }
            li {
                padding: 4px 8px;
                cursor: pointer;
                &:hover {
                    background-color: rgba(222, 222, 222, 0.49);
                }
            }
        }
    }
</style>