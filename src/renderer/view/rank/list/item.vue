<template>
    <li :class="s.item">
        <template v-if="info">
            <div :class="s.cover">
                {{info.name}}
                <div :class="s.play">
                    <play-loading v-if="loading"></play-loading>
                    <Icon type="play1" @click="playList" :class="s.icon" v-else></Icon>
                </div>
            </div>
            <div :class="s.img">
                <img :src="list[0] | defaultAlbum"/>
            </div>
            <ul :class="s.songs" @click="go2RankList">
                <li v-for="(song,index) in list" :class="s.song">
                    <span>{{index + 1}}</span>
                    <span>{{song.name}}</span>-
                    <span>
                        <template v-for="singer in song.artists">
                            {{singer.name}}
                        </template>
                    </span>
                </li>
            </ul>
        </template>
    </li>
</template>
<script>
    import playLoading from './play-loading.vue'
    import eventBus from '../eventBus'

    export default {
        props: {
            info: {
                default: null
            },
            vendor: String
        },
        components: {
            playLoading
        },
        data() {
            return {
                loading: false
            }
        },
        computed: {
            list() {
                return this.info ? this.info.list.slice(0, 3) : []
            }
        },
        methods: {
            // 播放排行榜
            async playList() {
                this.loading = true
                try {
                    const data = await eventBus.getRank(this.vendor, {
                        ids: [this.info.id]
                    })
                    if (data[0]) {
                        this.$store.dispatch('play/play', {
                            info: this.list[0],
                            playlist: data[0].list
                        })
                    } else {
                        this.$message.warning('无法获取榜单详情')
                    }
                } catch (e) {
                    console.warn(e)
                }
                this.loading = false
            },
            // 跳转至排行榜详情
            go2RankList() {
                this.$router.push({
                    name: 'rank.detail',
                    params: {
                        id: this.info.id
                    },
                    query: {
                        vendor: this.vendor
                    }
                })
            }
        }
    }
</script>
<style lang="scss" module="s">
    .item {
        display: inline-flex;
        width: calc(50% - 10px);
        height: 120px;
        margin-bottom: 20px;
        position: relative;
        margin-right: 10px;
        background-color: #f9f9f9;
        .cover {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            left: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.6);
            color: white;
            z-index: 2;
            transition: all .2s;
            text-align: center;
            user-select: none;
            .play {
                display: none;
                position: absolute;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                margin: auto;
                align-items: center;
                justify-content: center;
                .icon {
                    cursor: pointer;
                    color: white;
                    font-size: 40px;
                    padding: 8px;
                    padding-left: 12px;
                    border-radius: 50%;
                    background-color: #29c777;
                    transition: all .2s;
                    &:hover {
                        transition: all .2s;
                        background-color: #26A866;
                    }
                }
            }
            &:hover {
                transition: all .2s;
                background-color: rgba(0, 0, 0, 0.2);
                .play {
                    display: flex;
                }
                & + .img > img {
                    transform: scale(1.2, 1.2);
                }
            }
        }
        .img,
        .cover {
            width: 120px;
            height: 100%;
        }
        .img {
            overflow: hidden;
            img {
                transition: all .2s;
                width: 100%;
                height: 100%;
            }
        }
        .songs {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            padding: 20px 16px;
            list-style: none;
            background-color: #FBFBFB;
            cursor: pointer;
            width: calc(100% - 120px);
            &:hover {
                background-color: #f2f2f2;
            }
            .song {
                font-size: 13px;
                color: #231919;
                & > span {
                    display: inline-block;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    vertical-align: middle;
                }
                span:nth-child(2) {
                    width: 120px;
                }
                span:nth-child(3) {
                    width: 75px;
                }
            }
        }
    }
</style>