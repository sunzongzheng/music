<template>
    <div :class="s.messageItem">
        <p v-if="info.type === 'system'" :class="s.system">{{info.message}}</p>
        <template v-else>
            <p v-if="showTime" :class="s.time">{{info.datetime}}</p>
            <img :src="info.userInfo.avatar" :class="s.avatar"/>
            <div :class="s.main">
                <div :class="s.top">
                    {{info.userInfo.nickname}}
                </div>
                <div :class="s.message">
                    <template v-if="info.type === 'broadcast'">
                        {{info.message}}
                    </template>
                    <share-item v-else-if="info.type === 'share'" :message="info.message"></share-item>
                </div>
            </div>
        </template>
    </div>
</template>
<script>
    import shareItem from './share-item.vue'
    import moment from 'moment'

    export default {
        props: {
            info: {
                type: Object,
                required: true
            },
            index: Number,
            last: {
                type: Object | null,
                required: true
            }
        },
        components: {
            shareItem
        },
        computed: {
            showTime() {
                if (this.info.type === 'system') {
                    return false
                }
                if (this.index === 0) {
                    return true
                }
                if (moment(this.info.datetime).diff(moment(this.last.datetime), 'm') < 2) {
                    return false
                }
                return true
            }
        }
    }
</script>
<style lang="scss" module="s">
    .messageItem {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 18px;
        .system {
            font-size: 12px;
            color: $color-disabled;
            text-align: center;
            width: 100%;
            margin-bottom: -12px;
        }
        .time {
            width: 100%;
            font-size: 11px;
            color: $color-disabled;
            text-align: center;
        }
        .avatar {
            @include size(26px);
            border-radius: 50%;
        }
        .main {
            flex: 1;
            padding-left: 8px;
            .top {
                font-size: 12px;
                color: $color-sub;
            }
            .message {
                background: #f8f9f8;
                border-radius: 4px;
                padding: 12px 12px;
                margin-top: 8px;
                font-size: 14px;
            }
        }
    }
</style>