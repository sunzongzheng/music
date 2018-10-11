<template>
    <menu-item title="快捷键" :class="s.hotKey">
        <div :class="s.main">
            <el-row>
                <el-col :span="6">功能说明</el-col>
                <el-col :span="9">快捷键</el-col>
                <el-col :span="9">全局快捷键</el-col>
            </el-row>
            <el-row v-for="(item,index) in hotKey"
                    :key="item.name"
            >
                <el-col :span="6">{{item.name}}</el-col>
                <el-col :span="9">
                    <el-input :value="item.key | keyboardChar"
                              placeholder="空"
                              @keydown.native="keyup(index, 'key', $event)"
                              size="small"
                              @blur="onBlur(index, 'key')"
                    ></el-input>
                </el-col>
                <el-col :span="9">
                    <el-input :value="item.global | keyboardChar"
                              placeholder="空"
                              @keydown.native="keyup(index, 'global', $event)"
                              size="small"
                              :disabled="!enableGlobal"
                              @blur="onBlur(index, 'global')"
                    ></el-input>
                </el-col>
            </el-row>
            <div :class="s.bottom">
                <el-checkbox :value="enableGlobal"
                             @change="updateEnableGlobal($event)"
                >
                    启用全局快捷键（在后台也能响应）
                </el-checkbox>
                <el-button size="small" :class="s.recoverBtn" @click="reset">恢复默认</el-button>
            </div>
        </div>
    </menu-item>
</template>
<script>
    import menuItem from './menu-item.vue'
    import { cloneDeep } from 'lodash'
    import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'

    export default {
        components: {
            menuItem,
        },
        data() {
            return {
                hotKey: cloneDeep(Vue.$store.state['hot-key'].hotKey),
                input: '',
            }
        },
        computed: {
            ...mapState('hot-key', {
                enableGlobal: 'enableGlobal',
                savedHotKey: 'hotKey',
            }),
            ...mapGetters('hot-key', ['availableKeyCode', 'keyCode2RegisterKey']),
        },
        watch: {
            'savedHotKey'(val) {
                this.hotKey = cloneDeep(val)
            },
        },
        methods: {
            ...mapMutations('hot-key', ['updateHotKey', 'updateEnableGlobal', 'reset']),
            ...mapActions('hot-key', ['reset']),
            keyup(index, type, event) {
                console.log(event.keyCode)
                event.preventDefault()
                let rs
                if (event.keyCode === 0) { // 删除键 直接清空
                    rs = ''
                } else if (this.availableKeyCode.includes(event.keyCode)) { // 在可使用键范围内
                    let comboKey = []
                    if (event.shiftKey) {
                        comboKey.push('Shift')
                    }
                    if (event.altKey) {
                        comboKey.push('Alt')
                    }
                    if (event.metaKey) {
                        comboKey.push('Command')
                    }
                    if (event.ctrlKey) {
                        comboKey.push('Control')
                    }
                    comboKey.push(this.keyCode2RegisterKey[event.keyCode])
                    rs = Array.from(new Set(comboKey)).join('+')
                } else { // 不在 可使用键 范围内 直接return
                    return
                }
                // 非空 且 已存在 直接return
                if (rs && this.judgeExist(index, rs)) {
                    return
                }
                this.hotKey[index][type] = rs
            },
            // 判断是否已存在
            judgeExist(index, key) {
                for (let i = 0; i < this.savedHotKey.length; i++) {
                    if (index === i) continue
                    const item = this.savedHotKey[i]
                    if (item.key === key || item.global === key) {
                        return true
                    }
                }
                return false
            },
            onBlur(index, type) {
                this.updateHotKey({
                    index,
                    type,
                    val: this.hotKey[index][type],
                })
            },
        },
    }
</script>
<style lang="scss" module="s">
    .main {
        flex: 1;
        input {
            height: 28px;
            line-height: 28px;
            width: 180px;
            padding: 0 10px;
        }
        :global {
            .el-col {
                height: 32px;
                line-height: 32px;
                margin-bottom: 12px;
            }
        }
        .bottom {
            display: flex;
            align-items: center;
            margin-top: 12px;
            .recoverBtn {
                height: 22px;
                padding: 0 24px;
                margin-left: 12px;
                position: relative;
            }
        }
    }
</style>