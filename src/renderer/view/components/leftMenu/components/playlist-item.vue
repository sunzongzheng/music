<template>
    <menu-item :route="route"
               :class="s.playlistItem"
               :type="type === 'create' ? 'tag' : 'route'"
               @contextmenu.native="showContextMenu"
    >
        <input v-if="modify"
               @blur="confirmEdit"
               v-model="modifyName"
               :class="s.input"
               ref="input"
               @keyup.enter="modify = false"
        />
        <template v-else>
            {{title}}
        </template>
    </menu-item>
</template>
<script>
    import menuItem from './menu-item.vue'
    import {remote} from 'electron'

    export default {
        props: {
            route: Object,
            title: String,
            type: {
                type: String,
                default: 'normal' // normal | create
            },
            createDefaultName: ''
        },
        components: {
            menuItem
        },
        data() {
            return {
                menu: null,
                modify: this.type === 'normal' ? false : true,
                modifyName: this.createDefaultName
            }
        },
        methods: {
            // 创建右键菜单
            createMenu() {
                this.menu = remote.Menu.buildFromTemplate([
                    {
                        label: '重命名',
                        click: () => {
                            this.modifyName = this.title
                            this.modify = true
                            this.$nextTick(() => {
                                this.$refs.input.select()
                            })
                        }
                    },
                    {
                        label: '删除',
                        click: () => {
                            this.$emit('del')
                        }
                    }
                ])
            },
            // 显示右键菜单
            showContextMenu() {
                if(this.type === 'normal') {
                    this.menu.popup(remote.getCurrentWindow())
                }
            },
            // 修改
            confirmEdit() {
                this.$emit('saveInput', this.modifyName)
                this.modify = false
            }
        },
        created() {
            this.createMenu()
        },
        mounted() {
            this.$nextTick(() => {
                if(this.type === 'create') {
                    this.$refs.input.select()
                }
            })
        }
    }
</script>
<style lang="scss" module="s">
    .playlistItem {
        padding-left: 26px;
        position: relative;
        &::before {
            content: ' ';
            background: $color-disabled;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            position: absolute;
            left: 12px;
            top: 0;
            bottom: 0;
            margin: auto;
        }
        .input {
            font-size: 12px;
            width: 130px;
            margin-left: -1px;
        }
        &:global(.active)::before {
            background: white;
        }
    }
</style>