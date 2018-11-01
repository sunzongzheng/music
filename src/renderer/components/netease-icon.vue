<template>
    <Icon type="netease-music" :class="s.netease" v-if="active" v-on="$listeners"></Icon>
    <Icon type="netease-music-grey" :class="s.netease" v-else v-on="$listeners"></Icon>
</template>
<script>
    export default {
        props: {
            active: {
                type: Boolean,
                default: false,
            },
        },
    }
</script>
<style lang="scss" module="s">
    .netease {
        font-size: 20px;
    }
</style>