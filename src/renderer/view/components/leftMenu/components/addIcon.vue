<template>
    <Icon type="playlist-add"
          :class="s.icon"
          v-on="$listeners"
    ></Icon>
</template>
<style lang="scss" module="s">
    .icon {
        cursor: pointer;
        &:hover {
            color: $color-primary;
        }
    }
</style>