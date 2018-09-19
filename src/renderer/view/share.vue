<template>
    <div id="socialShare" :class="s.share"></div>
</template>
<script>
    import 'social-share.js/dist/css/share.min.css'
    import 'social-share.js/dist/js/social-share.min.js'

    export default {
        created() {
            this.$ipc.on('share-song-info', (event, params) => {
                this.$nextTick(() => {
                    const url = {
                        qq: `https://i.y.qq.com/v8/playsong.html?songid=${params.songId}`,
                        netease: `https://music.163.com/#/song?id=${params.songId}`,
                        xiami: `https://www.xiami.com/song/${params.songId}`
                    }[params.vendor]
                    window.socialShare('#socialShare', {
                        // 这里配置各种参数
                        sites: ['weibo', 'wechat', 'qq', 'twitter', 'google'],
                        mode: 'prepend',
                        source: '音乐湖',
                        origin: '音乐湖',
                        url,
                        title: `♪我正在收听${params.artists[0].name}的${params.name}`
                    })
                })
            })
        }
    }
</script>
<style lang="scss" module="s">
    .share {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        position: fixed;
        background: white;
        z-index: 200;
        left: 0;
        top: 0;
    }
</style>