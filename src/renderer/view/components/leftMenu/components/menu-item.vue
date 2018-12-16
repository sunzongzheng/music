<template>
    <router-link tag="li" :to="route" :class="s.menuItem" v-if="type === 'route'">
        <slot></slot>
    </router-link>
    <li :class="s.menuItem" v-else>
        <slot></slot>
    </li>
</template>
<script>
    export default {
        props: {
            type: {
                type: String,
                default: 'route' // route | tag
            },
            route: {
                type: String | Object
            }
        }
    }
</script>
<style lang="scss" module="s">
    .menuItem {
        display: flex;
        align-items: center;
        border-radius: 2px;
        cursor: pointer;
        color: $color-content;
        padding: 6px 8px;
        font-size: 13px;
        line-height: 1;
        user-select: none;
        &:hover {
            background-color: rgba(222, 222, 222, 0.49);
        }
        &:global(.active) {
            background: linear-gradient(to right, #30d07f, #2fcc7d);
            color: white;
        }
    }
</style>