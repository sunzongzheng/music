<template>
    <div :class="s.viewControl">
        <Icon
            type="leaveFullscreen"
            :class="s.fullscreen"
            @click="leaveFullscreen"
            v-if="status === 'fullscreen'"
        ></Icon>
        <div :class="s.inner" v-else>
            <Icon type="close" :class="s.close" @click="close"></Icon>
            <Icon type="narrow" :class="s.narrow" @click="minimize"></Icon>
            <Icon
                type="fullscreen"
                :class="s.fullscreen"
                @click="fullscreen"
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
    padding: 0 18px;
    -webkit-app-region: drag;
    & > * {
        -webkit-app-region: no-drag;
    }
    .inner {
        display: flex;
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
