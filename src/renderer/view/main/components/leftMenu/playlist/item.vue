<template>
    <li :class="s.li" ref="item">
        <router-link :to="{name:'playlist',params:{id:info.id}}" :key="info.name" v-if="!modify"
                     @contextmenu.native="contextMenuVisible = true">
            {{info.name}}
        </router-link>
        <input v-model="modifyName" ref="input" @blur="save" v-else/>
        <context-menu :class="s.menu"
                      :target="$refs.item"
                      :show="contextMenuVisible"
                      @update:show="(show) => contextMenuVisible = show">
            <ul>
                <li @click="rename">重命名</li>
                <li @click="del">删除</li>
            </ul>
        </context-menu>
    </li>
</template>
<script>
    export default {
        props: {
            info: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                contextMenuVisible: false,
                modify: false,
                modifyName: this.info.name
            }
        },
        methods: {
            rename() {
                this.modifyName = this.info.name
                this.modify = true
                this.$nextTick(() => {
                    this.$refs.input.focus()
                })
                this.contextMenuVisible = false
            },
            async save() {
                await this.$http.put(`/playlist/${this.info.id}`, {
                    name: this.modifyName
                })
                await this.$store.dispatch('playlist/init')
                this.modify = false
                this.$message({
                    message: '修改成功',
                    type: 'success'
                })
            },
            async del() {
                await this.$http.delete('/playlist', {
                    params: {
                        id: this.info.id
                    }
                })
                await this.$store.dispatch('playlist/init')
                this.contextMenuVisible = false
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
            }
        }
    }
</script>
<style lang="scss" module="s">
    .li {
        user-select: none;
        a {
            font-size: 13px;
            color: #333;
            text-decoration: none;
            display: block;
            width: 100%;
        }
        ul {
            list-style: none;
        }
        .menu {
            position: fixed;
            background: #fff;
            border: solid 1px rgba(0, 0, 0, .2);
            border-radius: 3px;
            z-index: 999;
            display: none;
        }
        .menu a {
            width: 75px;
            height: 28px;
            line-height: 28px;
            text-align: center;
            display: block;
            color: #1a1a1a;
        }
        .menu a:hover {
            background: #eee;
            color: #fff;
        }
    }
</style>