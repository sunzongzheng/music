<template>
    <div :class="s.dataTable" v-loading="loading">
        <div v-if="loading" style="min-height: 400px;"></div>
        <template v-else-if="data.length">
            <div :class="s.top" v-if="showTopBar">
                <p :class="s.total">
                    共&nbsp;<span>{{ data.length }}</span
                    >&nbsp;首歌曲
                </p>
                <el-input
                    placeholder="搜索歌曲名/歌手/专辑"
                    prefix-icon="el-icon-search"
                    v-model="keyword"
                    :class="s.input"
                    size="mini"
                ></el-input>
            </div>
            <el-row :class="[s.row, s.thead]">
                <el-col :span="spanList[0]">歌曲</el-col>
                <el-col :span="spanList[1]">歌手</el-col>
                <el-col :span="spanList[2]">专辑</el-col>
                <el-col :span="spanList[3]" v-if="!hideLastCol">{{
                    lastColName
                }}</el-col>
            </el-row>
            <el-row
                v-for="(item, index) in filterList"
                :class="{ [s.row]: true, [s.disabled]: item.cp }"
                :key="item.songId"
                @click.native="$emit('rowClick', item)"
                @contextmenu.native="showContextMenu(item)"
                @dblclick.native="doPlay(item)"
                @mouseenter.native="mouseenter(index)"
                @mouseleave.native="mouseleave(index)"
            >
                <el-col :span="spanList[0]">
                    <song-name
                        :song="item"
                        :ref="`songName_${index}`"
                        @showContextMenu="showContextMenu(item)"
                    ></song-name>
                </el-col>
                <el-col :span="spanList[1]">
                    <artists
                        :artists="item.artists"
                        :vendor="item.vendor"
                    ></artists>
                </el-col>
                <el-col :span="spanList[2]">
                    <album :album="item.album" :vendor="item.vendor"></album>
                </el-col>
                <el-col :span="spanList[3]" v-if="!hideLastCol">
                    <template v-if="$slots.lastCol">
                        <slot name="lastCol"></slot>
                    </template>
                    <template v-else>
                        {{ item.vendor | source }}
                    </template>
                </el-col>
            </el-row>
        </template>
        <no-data v-else></no-data>
    </div>
</template>
<script>
import noData from './components/no-data.vue'
import songName from './components/song-name.vue'
import artists from './components/artists.vue'
import album from './components/album.vue'
import { mapActions } from 'vuex'

export default {
    components: {
        noData,
        songName,
        artists,
        album,
    },
    props: {
        data: {
            type: Array,
            required: true,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        hideLastCol: {
            type: Boolean,
            default: false,
        },
        lastColName: {
            type: String,
            default: '来源',
        },
        // 列宽数组
        spanWidth: Array,
        // 是否显示顶部 歌曲数量 和 搜索框
        showTopBar: {
            type: Boolean,
            default: true
        },
        // 是否显示右键菜单
        contextMenu: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            page: 1,
            limit: 20,
            keyword: '',
        }
    },
    computed: {
        spanList() {
            return this.spanWidth
                ? this.spanWidth
                : this.hideLastCol
                ? [10, 8, 6]
                : [9, 7, 5, 3]
        },
        list() {
            if (!this.pagination) return this.data
            const start = (this.page - 1) * this.limit

            return this.data.slice(start, start + this.limit)
        },
        filterList() {
            return this.keyword ? this.list.filter(song => {
                return (
                    song.name.includes(this.keyword) ||
                    song.artists
                        .reduce((a, b) => a + b.name, '')
                        .includes(this.keyword) ||
                    song.album.name.includes(this.keyword)
                )
            }) : this.list
        },
    },
    methods: {
        ...mapActions('play', ['play']),
        ...mapActions('download', ['download']),
        doPlay(item) {
            this.play({
                info: item,
                playlist: this.data,
            })
        },
        // 显示右键菜单
        showContextMenu(item) {
            if (!this.contextMenu) return
            this.$contextMenu.song(
                {
                    ...item,
                    id: item.songId,
                },
                this.data
            )
        },
        mouseenter(index) {
            this.$refs[`songName_${index}`][0].showControl = true
        },
        mouseleave(index) {
            this.$refs[`songName_${index}`][0].showControl = false
        },
    },
}
</script>
<style lang="scss" module="s" src="./index.scss"></style>
