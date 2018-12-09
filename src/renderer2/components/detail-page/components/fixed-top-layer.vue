<template>
    <transition name="el-zoom-in-top">
        <div :class="s.fixedTop" v-if="fixed">
            <div :class="s.item">
                <img :src="cover | image(70)" :class="s.cover" />
                <span :class="s.name">{{ name }}</span>
            </div>
            <div :class="s.item">
                <m-button type="primary">
                    <Icon
                        type="arrow-play"
                        clickable
                        @click="$emit('play-all')"
                    ></Icon>
                    播放全部
                </m-button>
                <m-button>
                    <Icon
                        type="operate"
                        clickable
                        @click="$emit('batch-operate')"
                    ></Icon>
                    批量操作
                </m-button>
            </div>
        </div>
    </transition>
</template>
<script>
export default {
    props: {
        fixed: Boolean,
        cover: String,
        name: String,
    },
    data() {
        return {}
    },
    watch: {},
    methods: {},
}
</script>
<style lang="scss" module="s">
.fixedTop {
    position: fixed;
    top: 50px;
    left: 180px;
    width: calc(100% - 180px);
    background: white;
    height: 50px;
    padding: 0 32px;
    z-index: 99;
    box-shadow: 4px 6px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    .item {
        display: flex;
        align-items: center;
    }
    .cover {
        @include size(35px);
    }
    .name {
        margin: 0 12px;
    }
}
</style>
