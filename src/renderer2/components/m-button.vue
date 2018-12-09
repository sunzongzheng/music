<template>
    <el-button v-on="$listeners" v-bind="$attrs" :class="s.button">
        <slot></slot>
    </el-button>
</template>
<style lang="scss" module="s">
.button {
    height: 24px;
    padding: 0 16px;
    font-weight: normal;
    font-size: 12px;
}
</style>
