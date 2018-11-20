<template>
    <div :class="s.viewControl">
        <div :class="s.inner" v-if="status !== 'fullscreen'">
            <Icon
                type="close"
                :class="s.close"
                @click.native="op('close')"
            ></Icon>
            <Icon
                type="narrow"
                :class="s.narrow"
                @click.native="op('minimize')"
            ></Icon>
            <Icon
                type="fullscreen"
                :class="s.fullscreen"
                @click.native="op('fullscreen')"
            ></Icon>
        </div>
        <Icon
            type="fullscreenexit"
            :class="s.fullscreen"
            @click.native="op('leaveFullscreen')"
            v-else
        ></Icon>
    </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
    computed: {
        status() {
            return 'normal'
        },
        // ...mapState('windowStatus', ['status']),
    },
    methods: {
        op(val) {
            // this.$store.commit('windowStatus/update', val)
        },
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
