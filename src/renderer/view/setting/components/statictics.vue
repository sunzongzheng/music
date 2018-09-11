<template>
    <menu-item title="统计分析">
        <p>实时在线人数：{{onlineTotal}}</p>
    </menu-item>
</template>
<script>
    import menuItem from './menu-item.vue'
    import {mapState} from 'vuex'

    export default {
        components: {
            menuItem
        },
        computed: {
            ...mapState('socket', ['onlineTotal'])
        }
    }
</script>