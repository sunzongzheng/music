<template>
    <div :class="s.viewControl">
        <div :class="s.inner">
            <Icon type="close" :class="s.close" @click="close"></Icon>
            <Icon type="narrow" :class="s.narrow" @click="minimize"></Icon>
            <Icon type="leaveFullscreen"
                  :class="s.fullscreen"
                  @click="leaveFullscreen"
                  v-if="status === 'fullscreen'"
            ></Icon>
            <Icon type="fullscreen"
                  :class="s.fullscreen"
                  @click="fullscreen"
                  v-else
            ></Icon>
        </div>
    </div>
</template>
<script>
    import { mapState, mapActions } from 'vuex'

    export default {
        computed: {
            ...mapState('window', ['status']),
        },
        methods: {
            ...mapActions('window', [
                'close',
                'minimize',
                'fullscreen',
                'leaveFullscreen',
            ]),
        },
    }
</script>
<style lang="scss" module="s">
    .viewControl {
        display: flex;
        width: 100%;
        height: 24px;
        justify-content: flex-start;
        align-items: center;
        flex-shrink: 0;
        padding: 8px 18px 0;
        -webkit-app-region: drag;
        .inner {
            display: flex;
            -webkit-app-region: no-drag;
        }
        svg {
            border-radius: 50%;
            font-size: 12px;
            margin-right: 8px;
            use {
                display: none;
            }
        }
        &:hover {
            use {
                display: inline;
            }
        }
        .close {
            background-color: #fc615d;
        }
        .narrow {
            background-color: #fdbd41;
        }
        .fullscreen {
            background-color: #34c749;
        }
    }
</style>
