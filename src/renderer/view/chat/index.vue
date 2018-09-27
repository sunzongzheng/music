<template>
    <div :class="s.chat">
        <div :class="s.main">
            <div :class="s.history" ref="history">
                <message v-for="(item,index) in chatHistory"
                         :key="index"
                         :info="item"
                ></message>
            </div>
            <div :class="s.inputArea">
                <el-input v-model="input"
                          placeholder="回车发送"
                          :class="s.input"
                          ref="input"
                          @keyup.native.enter="submit"
                ></el-input>
            </div>
        </div>
        <div :class="s.onlineUsers">
            <p>在线成员（{{onlineUsers.length}}）</p>
            <ul>
                <li v-for="item in onlineUsers">
                    <img :src="item.avatar"/>
                    <span>{{item.nickname}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex'
    import message from './message.vue'
    import eventBus from '../../eventBus/chat'

    export default {
        components: {
            message
        },
        data() {
            return {
                input: ''
            }
        },
        computed: {
            ...mapState('socket', ['onlineUsers', 'chatHistory'])
        },
        methods: {
            submit() {
                if (!this.input.length) {
                    return
                }
                this.$socket.emit('broadcast', this.input)
                this.input = ''
            },
            scrollBottom() {
                this.$nextTick(() => {
                    setTimeout(() => {
                        this.$refs.history.scrollTop = this.$refs.history.offsetHeight
                    }, 200)
                })
            }
        },
        mounted() {
            this.scrollBottom()
            this.$nextTick(() => {
                this.$refs.input.focus()
            })
        },
        created() {
            eventBus.$on('scrollBottom', this.scrollBottom)
        },
        beforeDestroy() {
            eventBus.$off('scrollBottom', this.scrollBottom)
        }
    }
</script>
<style lang="scss" module="s">
    .chat {
        display: flex;
        width: 100%;
        height: 100%;
        .main {
            display: flex;
            flex-direction: column;
            height: 100%;
            flex: 1;
            .history {
                flex: 1;
                padding: 24px;
                word-break: break-all;
                overflow: auto;
            }
            .inputArea {
                height: 40px;
                padding-bottom: 4px;
                .input {
                    :global {
                        .el-input__inner {
                            border: none;
                            border-top: 1px solid $color-border4;
                        }
                    }
                }
            }
        }
        .onlineUsers {
            width: 145px;
            height: 100%;
            padding: 4px 12px;
            background: #f5f5f5;
            overflow: auto;
            p {
                font-size: 14px;
            }
            ul {
                li {
                    display: flex;
                    align-items: center;
                    margin-top: 12px;
                    img {
                        @include size(20px);
                        border-radius: 50%;
                    }
                    span {
                        margin-left: 4px;
                        font-size: 12px;
                        color: $color-sub;
                    }
                }
            }
        }
    }
</style>