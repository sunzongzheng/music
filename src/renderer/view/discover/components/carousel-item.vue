<template>
    <div :class="s.carouselItem">
        <div :class="s.top">
            <div :class="s.left">
                <p :class="s.title">{{title}}</p>
                <slot name="title-append"></slot>
            </div>
            <div :class="s.arrow">
                <i class="el-icon-arrow-left" @click="prev"></i>
                <i class="el-icon-arrow-right" @click="next"></i>
            </div>
        </div>
        <el-carousel :autoplay="false"
                     height="180px"
                     indicator-position="none"
                     arrow="never"
                     style="margin-top: 16px"
                     ref="carousel"
        >
            <el-carousel-item v-for="(item,index) in filterList"
                              :key="index"
            >
                <div :class="s.playlist">
                    <div :class="s.item" v-for="sub in item.sub" @click="$emit('on-click', sub)">
                        <render v-if="typeof sub.cover === 'function'" :render="sub.cover"></render>
                        <img :src="sub.cover | image(vendor, 280)" v-else/>
                        <p>{{sub.name}}</p>
                    </div>
                </div>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>
<script>
    import render from './render'
    export default {
        components: {
            render,
        },
        props: {
            title: String,
            list: {
                type: Array,
                default() {
                    return []
                }
            },
            vendor: {
                type: String,
                default: 'netease',
            }
        },
        computed: {
            filterList() {
                const rs = []
                let lastIndex = -1
                this.list.forEach((item, index) => {
                    if (index % 5 === 0) {
                        lastIndex++
                        rs.push({
                            sub: [item]
                        })
                    } else {
                        rs[lastIndex].sub.push(item)
                    }
                })
                return rs
            }
        },
        methods: {
            next() {
                this.$refs.carousel.next()
            },
            prev() {
                this.$refs.carousel.prev()
            },
        }
    }
</script>
<style lang="scss" module="s">
    .carouselItem {
        margin-top: 12px;
        .top {
            display: flex;
            justify-content: space-between;
            .left {
                display: flex;
                .title {
                    font-size: 16px;
                    color: $color-title;
                }
                .cate {
                    display: flex;
                    margin-left: 12px;
                    li {
                        display: flex;
                        align-items: center;
                        padding: 0 12px;
                        color: $color-sub;
                        font-size: 12px;
                        position: relative;
                        top: 1px;
                        cursor: pointer;
                        &:hover {
                            color: $color-content;
                        }
                        &:not(:last-child)::after {
                            content: ' ';
                            width: 1px;
                            height: 6px;
                            background: $color-border1;
                            position: absolute;
                            right: 0;
                            top: 0;
                            bottom: 0;
                            margin: auto;
                        }
                        &.active {
                            color: $color-content;
                        }
                    }
                }
            }
            .arrow {
                display: flex;
                align-items: center;
                color: $color-sub;
                i {
                    cursor: pointer;
                    margin-left: 8px;
                    border-radius: 50%;
                    border: 1px solid $color-border1;
                    font-size: 10px;
                    padding: 2px;
                    &:hover {
                        color: $color-primary;
                    }
                }
            }
        }
        .playlist {
            display: flex;
            justify-content: space-between;
            .item {
                width: 135px;
                font-size: 12px;
                cursor: pointer;
                img {
                    width: 100%;
                }
            }
        }
    }
</style>