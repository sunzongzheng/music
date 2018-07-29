<template>
    <div :class="s.lyric" :style="style">
        {{lyric}}
    </div>
</template>
<script>
    export default {
        props: {
            lyric: String,
            color: {
                type: String,
                default: 'white'
            }
        },
        computed: {
            style() {
                return {
                    color: this.color
                }
            }
        }
    }
</script>
<style lang="scss" module="s">
    .lyric {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 30px;
        white-space: nowrap;
        overflow: hidden;
        font-size: 23px;
    }
</style>