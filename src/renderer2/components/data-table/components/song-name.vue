<template>
    <div :class="s.songName">
        <div :class="s.info">
            <div :class="s.name" :title="song.name">{{ song.name }}</div>
            <quality :maxbr="song.maxbr" :class="s.quality" v-if="!song.cp"></quality>
            <Icon type="play-video" :class="s.mv" v-if="song.mv" @click="goMv(song.vendor, song.mv)"></Icon>
        </div>
        <div :class="s.control" v-show="showControl">
            <Icon
                type="arrow-play"
                @click="playSong(song)"
                v-if="!song.cp"
                clickable
            ></Icon>
            <Icon type="more" clickable @click="$emit('showContextMenu')"></Icon>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import {remote} from 'electron'

export default {
    props: {
        song: {
            type: Object,
            default() {
                return {}
            },
        },
    },
    data() {
        return {
            showControl: false,
        }
    },
    methods: {
        ...mapActions('audio', ['playSong']),
        goMv(vendor, id) {
            remote.shell.openExternal({
                qq: `https://y.qq.com/n/yqq/mv/v/${id}.html`,
                xiami: `https://www.xiami.com/mv/${id}`,
                netease: `https://music.163.com/#/mv?id=${id}`
            }[vendor])
        }
    },
}
</script>
<style lang="scss" module="s">
.songName {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    .info {
        display: flex;
        align-items: center;
        overflow: hidden;
        flex: 1;
        .name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
            user-select: none;
        }
        .quality {
            margin-left: 6px;
        }
        .mv {
            margin-left: 6px;
            color: #31C27C;
            font-size: 18px;
            cursor: pointer;
        }
    }

    .control {
        display: flex;
        align-items: center;
        color: $color-content;
        flex-shrink: 0;

        svg {
            margin-left: 9px;
            font-size: 14px;
        }
    }
}
</style>
