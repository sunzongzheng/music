<template>
    <li :class="s.item">
        <img :src="info.avatarurl" :class="s.avatar"/>
        <div :class="s.right">
            <a :class="s.name">{{info.nick}}</a>
            <p :class="s.content" v-html="comment"></p>
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
        },
        computed: {
            comment() {
                return this.info.rootcommentcontent
                    .replace(/\\n/g, '<br/>')
                    .replace(/\[em\](.*?)\[\/em\]/g, '<img src="//y.gtimg.cn/mediastyle/global/emoji/img/$1.png"/>')
            }
        }
    }
</script>
<style lang="scss" module="s">
    .item {
        display: flex;
        padding: 24px 0;
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
            img {
                position: relative;
                vertical-align: middle;
                top: -4px;
            }
        }
    }
</style>