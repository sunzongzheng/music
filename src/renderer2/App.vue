<template>
    <div :class="s.app">
        <left-menu></left-menu>
        <div :class="s.right">
            <top-section></top-section>
            <div :class="s.main"><router-view></router-view></div>
        </div>
    </div>
</template>
<script>
import leftMenu from './ui/left-menu/index.vue'
import topSection from './ui/top-section/index.vue'
import { mapGetters, mapActions } from 'vuex'

export default {
    components: {
        leftMenu,
        topSection,
    },
    computed: {
        ...mapGetters('user', ['logged']),
    },
    methods: {
        ...mapActions('user', ['init']),
    },
    mounted() {
        this.$nextTick(() => {
            document.body.removeChild(document.querySelector('#page-loading'))
        })
    },
    created() {
        if (this.logged) {
            this.init()
        }
    },
}
</script>
<style lang="scss" module="s">
html,
body {
    margin: 0;
    padding: 0;
    @include size(100%);
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.app {
    display: flex;
    flex-flow: row wrap;
    overflow: hidden;
    @include size(100%);
    .right {
        background: white;
        display: flex;
        flex: 1;
        flex-direction: column;
        .main {
            flex: 1;
        }
    }
}
</style>
