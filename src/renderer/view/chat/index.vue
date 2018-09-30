<template>
    <div :class="s.chat">
        <div :class="s.main">
            <div :class="s.history" ref="history">
                <message v-for="(item,index) in chatHistory"
                         :key="index"
                         :info="item"
                         :index="index"
                         :last="index === 0 ? null : chatHistory[index - 1]"
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
                    <div :class="s.info">
                        <img :src="item.avatar"/>
                        <span :title="item.nickname">{{item.nickname}}</span>
                    </div>
                    <Icon :class="s.platform" v-if="item.platform" :type="item.platform"></Icon>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import {mapState, mapMutations} from 'vuex'
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
            ...mapMutations('socket', ['update']),
            submit() {
                if (!this.input.length) {
                    return
                }
                this.$socket.emit('broadcast', this.input)
                this.input = ''
            },
            scrollBottom() {
                this.$nextTick(() => {
                    this.$refs.history.scrollTop = this.$refs.history.scrollHeight
                })
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.$refs.input.focus()
                this.scrollBottom()
            })
        },
        created() {
            eventBus.$on('scrollBottom', this.scrollBottom)
            this.update({
                readIndex: this.chatHistory.length
            })
        },
        beforeDestroy() {
            eventBus.$off('scrollBottom', this.scrollBottom)
        },
        beforeRouteEnter(to, from, next) {
            if (!Vue.$store.state.user.info) {
                next('/')
            } else {
                next()
            }
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
                position: relative;
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
            width: 160px;
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
                    justify-content: space-between;
                    .info {
                        display: flex;
                        align-items: center;
                        @include text-ellipsis;
                        img {
                            @include size(20px);
                            border-radius: 50%;
                        }
                        span {
                            margin-left: 4px;
                            font-size: 12px;
                            color: $color-sub;
                            @include text-ellipsis;
                        }
                    }
                    .platform {
                        color: $color-disabled;
                        flex-shrink: 0;
                    }
                }
            }
        }
    }
</style>