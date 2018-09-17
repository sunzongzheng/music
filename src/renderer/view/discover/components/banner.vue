<script type="text/jsx">
    import {remote} from 'electron'
    import {mapActions} from 'vuex'
    import eventBus from '../eventBus'

    export default {
        methods: {
            ...mapActions('play', ['play']),
            async getBanner() {
                const data = await this.$musicApi.netease.getBanner()
                if (data.status) {
                    eventBus.banner.list = data.data
                    this.$forceUpdate()
                } else {
                    this.$message.warning(data.msg)
                }
            },
            async bannerOnClick(url) {
                console.log(url)
                if (url.startsWith('http')) {
                    remote.shell.openExternal(url)
                } else if (url.startsWith('/album')) {
                    const obj = new URL(`https://music.163.com${url}`)
                    this.$router.push({
                        name: 'album.detail',
                        params: {
                            id: obj.searchParams.get('id')
                        },
                        query: {
                            vendor: 'netease'
                        }
                    })
                } else if (url.startsWith('/playlist')) {
                    const obj = new URL(`https://music.163.com${url}`)
                    this.$router.push({
                        name: 'musicPlaylist.detail',
                        params: {
                            id: obj.searchParams.get('id')
                        },
                        query: {
                            vendor: 'netease'
                        }
                    })
                } else if (url.startsWith('/mv')) {
                    const obj = new URL(`https://music.163.com${url}`)
                    this.$router.push({
                        name: 'mv.detail',
                        params: {
                            id: obj.searchParams.get('id')
                        },
                        query: {
                            vendor: 'netease'
                        }
                    })
                } else if (url.startsWith('/song')) {
                    const obj = new URL(`https://music.163.com${url}`)
                    const data = await this.$musicApi.getSongDetail('netease', obj.searchParams.get('id'))
                    if (data.status) {
                        this.play({
                            info: {
                                ...data.data,
                                vendor: 'netease',
                                songId: data.data.id
                            }
                        })
                    } else {
                        this.$message.warning(data.msg)
                    }
                } else {
                    remote.shell.openExternal(`https://music.163.com/#${url}`)
                }
            },
            getRenderData() {
                return (
                    <el-carousel type="card" height="210px" class={this.s.banner} trigger="click">
                        {
                            eventBus.banner.list.map((item, index) => {
                                return (
                                    <el-carousel-item>
                                        <img src={item.picUrl}
                                             class={this.s.bannerImg}
                                             onClick={() => this.bannerOnClick(item.url)}
                                        />
                                    </el-carousel-item>
                                )
                            })
                        }
                    </el-carousel>
                )
            },
        },
        async created() {
            // 没有缓存则 初始化
            if (!eventBus.banner.cache) {
                this.getBanner()
            }
        },
        render() {
            if (eventBus.banner.cache) {
                return eventBus.banner.cache
            } else {
                if (eventBus.banner.list.length) {
                    eventBus.banner.cache = this.getRenderData()
                    return eventBus.banner.cache
                } else {
                    return this.getRenderData()
                }
            }
        }
    }
</script>
<style lang="scss" module="s">
    .banner {
        .bannerImg {
            height: 100%;
            width: 100%;
        }
        :global {
            .el-carousel__item--card {
                width: 70%;
            }
            .el-carousel__item {
                left: -10%;
            }
        }
    }
</style>