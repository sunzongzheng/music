<template>
    <div :class="s.app">
        <div :class="s.inner" v-if="status!=='fullscreen'">
            <Icon type="close" :class="s.close" @click.native="op('close')"></Icon>
            <Icon type="narrow" :class="s.narrow" @click.native="op('minimize')"></Icon>
            <Icon type="fullscreen" :class="s.fullscreen" @click.native="op('fullscreen')"></Icon>
        </div>
        <Icon type="fullscreenexit" :class="s.fullscreen" @click.native="op('leaveFullscreen')" v-else></Icon>
    </div>
</template>
<script>
  import { mapState } from 'vuex'

  export default {
    computed: {
      ...mapState('windowStatus', ['status'])
    },
    methods: {
      op (val) {
        this.$store.commit('windowStatus/update', val)
      }
    }
  }
</script>
<style lang="scss" module="s">
    .app {
        display: flex;
        width: 100%;
        justify-content: flex-start;
        padding: 4px 9px;
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
            background-color: #FC615D;
        }
        .narrow {
            background-color: #FDBD41;
        }
        .fullscreen {
            background-color: #34C749;
        }
    }
</style>