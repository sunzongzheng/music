<template>
    <div :class="s.detailHeader">
        <img :src="cover"/>
        <div :class="s.right">
            <span :class="s.name">
                {{title}}
            </span>
            <slot></slot>
            <div :class="s.buttonGroup">
                <el-button type="primary" @click="$emit('play')" v-if="playText">
                    <icon type="item-play"></icon>
                    {{playText}}
                </el-button>
                <slot name="btns"></slot>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            title: String,
            playText: String,
            cover: {
                type: String,
                required: true
            }
        }
    }
</script>
<style lang="scss" module="s">
    .detailHeader {
        display: flex;
        background-color: #FAFAFA;
        padding: 26px;
        $imgWidth: 135px;
        & > img {
            width: $imgWidth;
            height: $imgWidth;
        }
        .right {
            display: flex;
            flex-direction: column;
            padding-left: 24px;
            width: calc(100% - #{$imgWidth});
            position: relative;
            .name {
                font-size: 22px;
                font-weight: bold;
                height: 32px;
            }
            .buttonGroup {
                position: absolute;
                bottom: 2px;
                left: 24px;
                cursor: pointer;
                display: flex;
                .play {
                    display: flex;
                    width: 100px;
                    height: 22px;
                    justify-content: center;
                    align-items: center;
                    border-radius: 4px;
                    font-size: 14px;
                    background-color: #67C23A;
                    color: white;
                    transition: all .2s;
                    &:hover {
                        transition: all .2s;
                        opacity: .8;
                    }
                }
                & > button {
                    height: 24px;
                    padding: 0 16px;
                    font-weight: normal;
                    font-size: 12px;
                    margin-right: 4px;
                }
            }
        }
    }
</style>