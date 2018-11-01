<template>
    <Icon type="qq-music" :class="s.qq" v-if="active" v-on="$listeners"></Icon>
    <Icon type="qq-music-grey" :class="s.qq" v-else v-on="$listeners"></Icon>
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
    .qq {
        font-size: 20px;
    }
</style>