<template>
    <div :class="s.navigation">
        <Icon type="left" :class="s.icon" clickable></Icon>
        <Icon type="left" :class="[s.icon, s.next]" clickable></Icon>
        <Icon type="shuaxin" :class="s.icon" clickable></Icon>
    </div>
</template>
<style lang="scss" module="s">
.navigation {
    .icon {
        margin-right: 12px;
        &.next {
            transform: rotate(180deg);
        }
    }
}
</style>
