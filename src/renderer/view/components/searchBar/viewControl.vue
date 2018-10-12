<template>
    <div :class="s.viewControl">
        <template v-if="status !== 'fullscreen'">
            <Icon type="windows-minimize" @click.native="op('minimize')" title="最小化"></Icon>
            <Icon type="windows-fullscreen" @click.native="op('fullscreen')" title="全屏"></Icon>
            <Icon type="windows-close" @click.native="op('close')" title="关闭"></Icon>
        </template>
        <Icon type="windows-recover" @click.native="op('leaveFullscreen')" title="还原" v-else></Icon>
    </div>
</template>
<script>
    import { mapState } from 'vuex'

    export default {
        computed: {
            ...mapState('windowStatus', ['status']),
        },
        methods: {
            op(val) {
                this.$store.commit('windowStatus/update', val)
            },
        },
    }
</script>
<style lang="scss" module="s">
    .viewControl {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        & > * {
            -webkit-app-region: no-drag;
        }
        svg {
            font-size: 14px;
            margin-left: 16px;
            cursor: pointer;
            color: $color-content;
            &:hover {
                color: $color-primary;
            }
        }
    }
</style>