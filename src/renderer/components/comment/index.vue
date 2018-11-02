<template>
    <div :class="s.commentList">
        <template v-if="hotComments.length">
            <title-bar :title="`精彩评论（${hotComments.length}）`"></title-bar>
            <ul style="margin-bottom: 24px">
                <component v-for="item in hotComments"
                           :is="`${vendor}CommentItem`"
                           :key="item.id"
                           :info="item"
                ></component>
            </ul>
        </template>
        <title-bar :title="`最新评论（${total}）`"></title-bar>
        <ul>
            <component v-for="item in comments"
                       :is="`${vendor}CommentItem`"
                       :key="item.id"
                       :info="item"
            ></component>
        </ul>
    </div>
</template>
<script>
    import titleBar from './components/titleBar.vue'
    import neteaseCommentItem from './components/neteaseItem.vue'
    import qqCommentItem from './components/qqItem.vue'
    import xiamiCommentItem from './components/xiamiItem.vue'

    export default {
        props: {
            hotComments: {
                type: Array,
                default() {
                    return []
                }
            },
            comments: {
                type: Array,
                default() {
                    return []
                }
            },
            total: {
                type: Number,
                default: 0
            },
            vendor: {
                type: String,
                required: true
            }
        },
        components: {
            titleBar,
            neteaseCommentItem,
            qqCommentItem,
            xiamiCommentItem
        }
    }
</script>
<style lang="scss" module="s">
    .commentList {
        padding: 24px;
    }
</style>