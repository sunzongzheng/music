<template>
    <router-link tag="li" :to="{name:'playlist',params:{id:info.id},query:{offline:true}}" :class="s.li" ref="item">
        <span v-if="!modify" @contextmenu.native="contextMenuVisible = true">
            {{info.name}}
        </span>
        <input v-model="modifyName" ref="input" @blur="_rename" v-else/>
        <context-menu :class="s.menu"
                      :target="$refs.item"
                      :show="contextMenuVisible"
                      @update:show="(show) => contextMenuVisible = show">
            <ul>
                <li @click="showRenameInput">重命名</li>
                <li @click="_del">删除</li>
            </ul>
        </context-menu>
    </router-link>
</template>
<script>
    import {mapMutations, mapState} from 'vuex'

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
        computed: {
            ...mapState('offline-playlist', ['offline_playlist'])
        },
        methods: {
            ...mapMutations('offline-playlist', ['rename', 'del']),
            showRenameInput() {
                this.modifyName = this.info.name
                this.modify = true
                this.$nextTick(() => {
                    this.$refs.input.focus()
                })
                this.contextMenuVisible = false
            },
            _rename() {
                if (this.offline_playlist.filter(item => item.name === this.modifyName && item.id !== this.info.id).length) {
                    Vue.$message.warning('名称重复')
                    return
                }
                this.rename({
                    id: this.info.id,
                    name: this.modifyName
                })
                this.modify = false
                this.$message({
                    message: '修改成功',
                    type: 'success'
                })
            },
            _del() {
                this.del(this.info.id)
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
        position: relative;
        padding-left: 22px !important;
        &::before {
            content: ' ';
            background: $color-disabled;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            position: absolute;
            left: 11px;
            top: 0;
            bottom: 0;
            margin: auto;
        }
        &:global(.active) {
            &::before{
                background: white;
            }
        }
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