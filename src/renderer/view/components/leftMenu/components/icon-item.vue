<template>
    <menu-item :route="route" :class="s.menuItem">
        <Icon :type="icon" :class="s.icon"></Icon>
        <span>{{title}}</span>
    </menu-item>
</template>
<script>
    import menuItem from './menu-item.vue'

    export default {
        props: {
            route: String,
            icon: String,
            title: String
        },
        components: {
            menuItem
        }
    }
</script>
<style lang="scss" module="s">
    .menuItem {
        span {
            margin-left: 4px;
        }
    }
</style>