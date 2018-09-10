<template>
    <li :class="s.item">
        <div :class="s.main">
            <img :src="info.user.avatarUrl + '?param=50y50'" :class="s.avatar"/>
            <div :class="s.right">
                <a :class="s.name">{{info.user.nickname}}</a>
                <span :class="s.content">{{info.content}}</span>
                <!--<span :class="s.time">{{info.time | dateDiff}}</span>-->
            </div>
        </div>
        <div :class="s.reply" v-for="item in info.beReplied">
            <a :class="s.name">{{item.user.nickname}}</a>&nbsp;:&nbsp;
            <span>{{item.content}}</span>
        </div>
    </li>
</template>
<script>
  export default {
    props: {
      info: {
        type: Object,
        required: true
      }
    }
  }
</script>
<style lang="scss" module="s">
    .item {
        display: flex;
        flex-direction: column;
        padding: 24px 0;
        .main {
            display: flex;
            .avatar {
                @include size(50px);
                border-radius: 50%;
                display: inline-flex;
            }
            .right {
                display: flex;
                flex-direction: column;
                padding-left: 24px;
                flex: 1;
                .name {
                    color: #989898;
                    font-size: 16px;
                    margin-bottom: 8px;
                }
                .content {
                    color: $color-content;
                    font-size: 14px;
                }
                .time {
                    text-align: right;
                    font-size: 12px;
                    color: $color-sub;
                }
            }
        }
        .reply {
            font-size: 14px;
            margin-left: 74px;
            margin-top: 8px;
            background-color: #f8f8f8;
            padding: 8px;
            .name {
                color: $color-primary-blue;
            }
        }
    }
</style>