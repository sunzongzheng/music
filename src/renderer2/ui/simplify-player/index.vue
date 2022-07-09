<template>
    <div :class="s.simplifyPlayer">
        <div :class="s.viewControl">
            <Icon type="close" :class="s.icon" clickable @click="close"></Icon>
            <Icon type="zuidahua" :class="s.icon" @click="backNormal" clickable></Icon>
        </div>
        <left></left>
    </div>
</template>
<script>
    import { mapActions } from 'vuex'
    import left from '../player/components/left.vue'

    export default {
        components: {
            left
        },
        methods: {
            ...mapActions('window', ['backNormal', 'close']),
        }
    }
</script>
<style lang="scss" module="s">
    .simplifyPlayer {
        padding-left: 4px;
        padding-top: 6px;
        -webkit-app-region: drag;
        .viewControl {
            display: flex;
            flex-direction: column;
            .icon {
                color: $color-sub;
            }
        }
    }
</style>