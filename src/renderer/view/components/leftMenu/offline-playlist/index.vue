<template>
    <menu-section title="离线歌单">
        <add-icon @click="showAddInput" slot="append"></add-icon>
        <playlist-item type="create"
                       @saveInput="create"
                       :createDefaultName="createDefaultName"
                       v-if="add"
        ></playlist-item>
        <playlist-item v-for="item in offline_playlist"
                       :key="item.id"
                       :title="item.name"
                       :route="{ name: 'playlist' , params: { id: item.id } , query: { offline: true } } "
                       @saveInput="_rename($event, item.id)"
                       @del="_del(item.id)"
        ></playlist-item>
    </menu-section>
</template>
<script>
    import {mapState, mapMutations} from 'vuex'
    import menuSection from '../components/menu-section.vue'
    import playlistItem from '../components/playlist-item.vue'
    import addIcon from '../components/addIcon.vue'

    export default {
        components: {menuSection, playlistItem, addIcon},
        data() {
            return {
                add: false, // 添加中
                createDefaultName: '',
            }
        },
        computed: {
            ...mapState('offline-playlist', ['offline_playlist'])
        },
        methods: {
            ...mapMutations('offline-playlist', ['rename', 'del']),
            getName() {
                let num = 1
                let name = '新建歌单'
                while (num) {
                    if (this.offline_playlist.filter(item => item.name === (name + num)).length) {
                        num++
                    } else {
                        name += num
                        num = 0
                    }
                }
                return name
            },
            // 显示输入框
            showAddInput() {
                this.createDefaultName = this.getName()
                this.add = true
            },
            // 重命名
            _rename(name, id) {
                if (this.offline_playlist.filter(item => item.name === name && item.id !== id).length) {
                    Vue.$message.warning('名称重复')
                    return
                }
                this.rename({
                    id,
                    name
                })
                this.$message.success('修改成功')
            },
            // 删除
            _del(id) {
                this.del(id)
                this.$message.success('删除成功')
            },
            async create(name) {
                if (!name) {
                    this.add = false
                    return
                }
                if (this.offline_playlist.filter(item => item.name === name).length) {
                    this.$message({
                        message: '不允许创建同名歌单',
                        type: 'warning'
                    })
                    this.add = false
                    return
                }
                await this.$store.commit('offline-playlist/add', name)
                this.$store.dispatch('offline-playlist/init')
                this.add = false
            }
        }
    }
</script>
<style lang="scss" module="s"></style>