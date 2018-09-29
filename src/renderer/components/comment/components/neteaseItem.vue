<template>
    <li :class="s.item">
        <div :class="s.main">
            <img :src="info.user.avatarUrl + '?param=50y50'" :class="s.avatar"/>
            <div :class="s.right">
                <a :class="s.name">{{info.user.nickname}}</a>
                <p :class="s.content" v-html="comment"></p>
                <!--<span :class="s.time">{{info.time | dateDiff}}</span>-->
            </div>
        </div>
        <div :class="s.reply" v-for="item in info.beReplied">
            <a :class="s.name">{{item.user.nickname}}</a>&nbsp;:&nbsp;
            <span>{{item.content}}</span>
        </div>
    </li>
</template>
<script>
    export default {
        props: {
            info: {
                type: Object,
                required: true
            }
        },
        computed: {
            comment() {
                const meta = {
                    "大笑": "86",
                    "可爱": "85",
                    "憨笑": "359",
                    "色": "95",
                    "亲亲": "363",
                    "惊恐": "96",
                    "流泪": "356",
                    "亲": "362",
                    "呆": "352",
                    "哀伤": "342",
                    "呲牙": "343",
                    "吐舌": "348",
                    "撇嘴": "353",
                    "怒": "361",
                    "奸笑": "341",
                    "汗": "97",
                    "痛苦": "346",
                    "惶恐": "354",
                    "生病": "350",
                    "口罩": "351",
                    "大哭": "357",
                    "晕": "355",
                    "发怒": "115",
                    "开心": "360",
                    "鬼脸": "94",
                    "皱眉": "87",
                    "流感": "358",
                    "爱心": "33",
                    "心碎": "34",
                    "钟情": "303",
                    "星星": "309",
                    "生气": "314",
                    "便便": "89",
                    "强": "13",
                    "弱": "372",
                    "拜": "14",
                    "牵手": "379",
                    "跳舞": "380",
                    "禁止": "374",
                    "这边": "262",
                    "爱意": "106",
                    "示爱": "376",
                    "嘴唇": "367",
                    "狗": "81",
                    "猫": "78",
                    "猪": "100",
                    "兔子": "459",
                    "小鸡": "450",
                    "公鸡": "461",
                    "幽灵": "116",
                    "圣诞": "411",
                    "外星": "101",
                    "钻石": "52",
                    "礼物": "107",
                    "男孩": "0",
                    "女孩": "1",
                    "蛋糕": "337",
                    18: "186",
                    "圈": "312",
                    "叉": "313"
                }
                let rs = this.info.content
                Object.keys(meta).forEach(item => {
                    const pattern = new RegExp('\\[' + item + '\\]', 'g')
                    rs = rs.replace(pattern, `<img src="http://s1.music.126.net/style/web2/emt/emoji_${meta[item]}.png"/>`)
                })
                return rs
            }
        }
    }
</script>
<style lang="scss" module="s">
    .item {
        display: flex;
        flex-direction: column;
        padding: 24px 0;
        .main {
            display: flex;
            .avatar {
                @include size(50px);
                border-radius: 50%;
                display: inline-flex;
            }
            .right {
                display: flex;
                flex-direction: column;
                padding-left: 24px;
                flex: 1;
                .name {
                    color: #989898;
                    font-size: 16px;
                    margin-bottom: 8px;
                }
                .content {
                    color: $color-content;
                    font-size: 14px;
                    img {
                        position: relative;
                        vertical-align: middle;
                        top: -4px;
                    }
                }
                .time {
                    text-align: right;
                    font-size: 12px;
                    color: $color-sub;
                }
            }
        }
        .reply {
            font-size: 14px;
            margin-left: 74px;
            margin-top: 8px;
            background-color: #f8f8f8;
            padding: 8px;
            .name {
                color: $color-primary-blue;
            }
        }
    }
</style>