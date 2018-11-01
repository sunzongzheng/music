<template>
    <div :class="s.playlistCover">
        <span :class="s.head">{{week}}</span>
        <span :class="s.day">{{day}}</span>
        <div :class="s.mask"></div>
        <Icon type="play1" :class="s.icon"></Icon>
    </div>
</template>
<script>
    export default {
        data() {
            const weekNumberText = {
                0: '日',
                1: '一',
                2: '二',
                3: '三',
                4: '四',
                5: '五',
                6: '六',
            }[new Date().getDay()]
            return {
                day: new Date().getDate(),
                week: `星期${weekNumberText}`,
            }
        },
    }
</script>
<style lang="scss" module="s">
    .playlistCover {
        display: flex;
        align-items: center;
        justify-content: center;
        @include size(135px);
        color: $color-title;
        border: 1px solid $color-border2;
        position: relative;
        padding-top: 28px;
        border-radius: 10px;
        overflow: hidden;
        cursor: pointer;
        margin-bottom: 4px;
        .head {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 28px;
            line-height: 28px;
            background: url('https://s2.music.126.net/style/web2/img/date.png?abcf54adc3952c1219f7155c083f8d43') no-repeat 0 0;
            text-align: center;
            color: #fed9d9;
            font-size: 14px;
        }
        .day {
            font-size: 94px;
            font-weight: bold;
        }
        .mask {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 107px;
            background: url('https://s2.music.126.net/style/web2/img/date.png?abcf54adc3952c1219f7155c083f8d43') no-repeat 0 -150px;
        }
        .icon {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            opacity: 0;
            cursor: pointer;
            color: white;
            font-size: 40px;
            background-color: #29c777;
            border-radius: 50%;
            padding: 8px;
            padding-left: 12px;
        }
        &:hover {
            opacity: .8;
            transition: opacity .25s;
            .icon {
                opacity: 1;
            }
        }
    }
</style>