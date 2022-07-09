<template>
    <div :class="s.detailPage">
        <!-- 回到顶部浮层 ! -->
        <back-top-layer :fixed="fixed"></back-top-layer>
        <div :class="s.top" v-loading="!name" ref="top">
            <cover :src="cover"></cover>
            <div :class="s.detail">
                <p :class="s.name">{{ name }}</p>
                <div :class="s.description">
                    <slot name="description"></slot>
                </div>
                <div :class="s.btns">
                    <m-button type="primary" @click="playList({ list: songs })">
                        <Icon type="arrow-play"></Icon>
                        播放全部
                    </m-button>
                    <slot name="btns"></slot>
                </div>
            </div>
        </div>
        <data-table :data="songs" :loading="songsLoading"></data-table>
    </div>
</template>
<script>
import cover from './components/cover.vue'
import backTopLayer from './components/back-top-layer.vue'
import { mapActions } from 'vuex'

export default {
    components: {
        cover,
        backTopLayer,
    },
    props: {
        name: String,
        cover: String,
        songs: {
            type: Array,
            default() {
                return []
            },
        },
        songsLoading: Boolean,
    },
    data() {
        return {
            fixed: false,
        }
    },
    methods: {
        ...mapActions('audio', ['playList']),
    },
    mounted() {
        let last_known_scroll_position = 0
        let ticking = false
        this.$el.addEventListener('scroll', e => {
            last_known_scroll_position = this.$el.scrollTop
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (
                        last_known_scroll_position > this.$refs.top.offsetHeight
                    ) {
                        this.fixed = true
                    } else {
                        this.fixed = false
                    }
                    ticking = false
                })
            }
            ticking = true
        })
    },
}
</script>
<style lang="scss" module="s">
.detailPage {
    overflow: auto;
    height: 100%;
    .top {
        display: flex;
        padding: 24px;
        background: rgba(208, 208, 208, 0.1);
        .detail {
            padding: 0 24px;
            .name {
                color: $color-title;
                font-size: 28px;
                font-weight: bold;
            }
            .description {
                max-height: 60px;
                overflow: auto;
            }
        }
        .btns {
            width: 100%;
            margin-top: 12px;
        }
    }
}
</style>
