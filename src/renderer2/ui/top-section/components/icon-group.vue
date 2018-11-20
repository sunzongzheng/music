<template>
    <div :class="s.iconGroup">
        <Icon type="shezhi1" :class="s.icon"></Icon>
        <Icon type="mini" :class="s.icon"></Icon>
    </div>
</template>
<style lang="scss" module="s">
.iconGroup {
    position: relative;
    $gap: 24px;
    margin-left: $gap;
    padding-left: $gap;
    $iconMargin: 16px;
    margin-right: -$iconMargin;
    &::before {
        content: ' ';
        background: $color-disabled;
        width: 1px;
        height: 16px;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        margin: auto;
    }
    .icon {
        @include link();
        margin-right: $iconMargin;
    }
}
</style>
