<template>
    <router-link :class="s.item" :to="route">
        <Icon :type="icon" v-if="icon" :class="s.icon"></Icon>
        <span :class="s.name">{{ name }}</span>
    </router-link>
</template>
<script>
export default {
    props: {
        icon: String,
        name: String,
        playing: Boolean,
        route: {},
    },
}
</script>
<style lang="scss" module="s">
.item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
    .icon {
    }
    .name {
        font-size: 15px;
        font-weight: bold;
        color: #666;
        line-height: 1;
    }
    &:global(.active) {
        background: $color-primary;
        border-radius: 4px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
        .name {
            color: white;
        }
    }
    &:hover {
        transition: all 0.2s;
        opacity: 0.9;
        &:not(.active):hover {
            opacity: 0.75;
        }
    }
}
</style>
