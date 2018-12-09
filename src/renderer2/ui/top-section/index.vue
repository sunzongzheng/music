<template>
    <div :class="s.topSection">
        <div :class="s.section">
            <navigation></navigation>
            <search-input></search-input>
        </div>
        <div :class="s.section">
            <profile></profile>
            <icon-group></icon-group>
        </div>
    </div>
</template>
<script>
import navigation from './components/navigation.vue'
import searchInput from './components/search-input.vue'
import profile from './components/profile/index.vue'
import iconGroup from './components/icon-group.vue'

export default {
    components: {
        navigation,
        searchInput,
        profile,
        iconGroup,
    },
}
</script>
<style lang="scss" module="s">
.topSection {
    height: 50px;
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    .section {
        display: flex;
        align-items: center;
    }
}
</style>
