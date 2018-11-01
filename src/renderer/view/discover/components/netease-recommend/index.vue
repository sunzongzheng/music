<template>
    <carousel-item title="网易云个性推荐"
                   :list="list"
                   @on-click="clickHandle"
                   :class="s.neteaseRecommend"
    ></carousel-item>
</template>
<script>
    import carouselItem from '../carousel-item.vue'
    import playlistCover from './playlistCover.vue'
    import { mapState, mapActions } from 'vuex'
    import fly from 'flyio'

    export default {
        components: {
            carouselItem,
        },
        data() {
            return {
                list: [],
            }
        },
        computed: {
            ...mapState('user', ['setting']),
        },
        methods: {
            ...mapActions('play', ['playAll']),
            async clickHandle(item) {
                if (item.id === 'daily') {
                    const data = await this.$musicApi.netease.getRecommendSongs()
                    if (data.status) {
                        this.playAll(data.data.map(item => {
                            item.vendor = 'netease'
                            item.songId = item.id
                            return item
                        }))
                    } else {
                        this.$message.warning(data.msg)
                    }
                } else {
                    this.$router.push({
                        name: 'musicPlaylist.detail',
                        params: {
                            id: item.id,
                        },
                        query: {
                            vendor: 'netease',
                        },
                    })
                }
            },
            async getRecommend() {
                const response = await fly.post('https://music.163.com/eapi/batch', {
                    params: '0BD8BB39A78692F1744DEFF63EBC30F7889FA0D28FD18C56783C7BF3AADA4C516E269DCEF72717031B0D0797563D21D74A80931032E90A0DBF772B7B86DAB7B29C47227066BA6859EF81B2BDC94960501592EFDBED2FA4BB612DD34C3BE69C1CB997189A2D14BE23FACD2D81694F87D706DA8A0E49133174CFCF86B6D83D4F26A9697354DF17CF16690DDE373535FB10DF1EF4EEA5EF20C5D84251F0DAB0B4DBFB6E4CC13080D0C5293B292AB02C201553C13DF8BA579BEA6766DEF7F6B05BF5F3F86DD6D30AC3C14A85C6B6DCBE03B0555937597BFDB81433F92FC92EB6681D2BDFDD43655A0BED91C3F081E40400EBAD9A9F926C5E1B3979139277DBCDF27E7EB4BFC0C4996CD069835883475527C7D296034459225E90FC0FD45F259EDAD7B8A586084B95ED965D4F14B71987EBFE986C003302C060E4BE9F0FA4C289882228C7C1FB8AD15297737A0138C365B73C267E6BA157E3256F2924B9A2DD0B1F4C001E848DC9F85F05DE82FCCA50763549329EF9DF1BC9746B9CFB7308D72159C5A5DC242B76960F7E62827FD52B8F4BCF7A667EBDAD93E5D34CB68D92ECBCD7FEE9265DD359457ED508F38B088041E5BBFDB949F891FA490B48B24C2C754762F31DC4C0F0C8E3930D08A628D82D10C6CADDEA0BBDF8D9FF405C9FE9B2E5622BD99757F50109BF2BBE0B6804606EB5EF23E3D772D023013244905739680AC5801E039D02D768DDB47BE085BE698DFA91C29B13F34AFEC3DA8E69251F8EB21D1A1109518C2909644CEF3C519BB71EDDACDF49099941CF0112F9C992766C4F08182DB6A27106D6C6223DBCC49EC284E67DBB',
                }, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Cookie: this.setting.bind.netease.cookies,
                        'Origin': 'orpheus://orpheus',
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14) AppleWebKit/605.1.15 (KHTML, like Gecko)',
                        'batch-method': 'GET',
                        'Host': 'music.163.com',
                    },
                    rejectUnauthorized: false,
                })
                const data = response.data['/api/discovery/recommend/resource']
                if (data.code === 200) {
                    this.list = [
                        {
                            id: 'daily',
                            cover: h => h(playlistCover),
                            name: '每日歌曲推荐',
                        },
                    ].concat(data.recommend.slice(0, 4).map(item => {
                        item.cover = item.picUrl
                        return item
                    }))
                } else {
                    this.$message.warning('请求失败')
                }
            },
        },
        created() {
            this.getRecommend()
        },
    }
</script>
<style lang="scss" module="s">
    .neteaseRecommend {
        margin-top: 24px;
    }
</style>