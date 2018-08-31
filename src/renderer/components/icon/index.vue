<template>
    <svg :class="{ [s.icon]:true, [s.disabled]: disabled }" aria-hidden="true" v-if="disabled">
        <use :xlink:href="`#icon-${type}`"></use>
    </svg>
    <svg :class="{ [s.icon]:true, [s.clickable]:clickable }" aria-hidden="true" v-on="$listeners" v-else>
        <use :xlink:href="`#icon-${type}`"></use>
    </svg>
</template>
<script>
    export default {
        props: {
            type: {
                type: String,
                required: true
            },
            disabled: {
                type: Boolean,
                default: false
            },
            clickable: {
                type: Boolean,
                default: false
            }
        }
    }
</script>
<style lang="scss" module="s">
    .icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
        &.disabled {
            opacity: 0.6;
            cursor: not-allowed !important;
        }
        &.clickable {
            &:hover {
                color: $color-primary;
                cursor: pointer;
            }
        }
    }
</style>