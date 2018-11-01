<template>
    <div :class="s.playlistCover">
        <span :class="s.english">{{month.e}}</span>
        <span :class="s.chinese">{{month.c}}月</span>
        <span :class="s.day">{{day}}</span>
        <Icon type="play1" :class="s.icon"></Icon>
    </div>
</template>
<script>
    export default {
        data() {
            const month = {
                1: {
                    c: '一',
                    e: 'Jan',
                },
                2: {
                    c: '二',
                    e: 'Feb',
                },
                3: {
                    c: '三',
                    e: 'Mar',
                },
                4: {
                    c: '四',
                    e: 'Apr',
                },
                5: {
                    c: '五',
                    e: 'May',
                },
                6: {
                    c: '六',
                    e: 'Jun',
                },
                7: {
                    c: '七',
                    e: 'Jul',
                },
                8: {
                    c: '八',
                    e: 'Aug',
                },
                9: {
                    c: '九',
                    e: 'Sep',
                },
                10: {
                    c: '十',
                    e: 'Oct',
                },
                11: {
                    c: '十一',
                    e: 'Nov',
                },
                12: {
                    c: '十二',
                    e: 'Dec',
                },
            }[new Date().getMonth() + 1]
            return {
                day: new Date().getDate(),
                month,
            }
        },
    }
</script>
<style lang="scss" module="s">
    .playlistCover {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        @include size(135px);
        overflow: hidden;
        cursor: pointer;
        margin-bottom: 4px;
        background: url("https://y.gtimg.cn/mediastyle/macmusic_v4/img/recommend_cover_bg.png") no-repeat;
        background-color: black;
        background-size: cover;
        color: white;
        position: relative;
        transition: opacity .25s;
        .english {
            margin-bottom: 6px;
            font-size: 16px;
        }
        .chinese {
            margin-bottom: 4px;
            position: relative;
            &::before,
            &::after {
                content: ' ';
                background: white;
                position: absolute;
                top: 0;
                bottom: 0;
                margin: auto;
                @include size(1px);
                border-radius: 50%;
            }
            &::before {
                left: -8px;
            }
            &::after {
                right: -8px;
            }
        }
        .day {
            font-size: 34px;
            font-weight: bold;
            margin-bottom: 20px;
            -webkit-font-smoothing: antialiased;
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