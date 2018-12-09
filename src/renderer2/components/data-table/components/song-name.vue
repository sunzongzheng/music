<template>
    <div :class="s.songName">
        <div :class="s.info">
            <div :class="s.name" :title="song.name">{{ song.name }}</div>
            <quality :quality="song.quality" :class="s.quality"></quality>
        </div>
        <div :class="s.control" v-show="showControl">
            <Icon
                type="arrow-play"
                @click="playSong(song)"
                v-if="!song.cp"
                clickable
            ></Icon>
            <Icon
                type="download"
                clickable
                :disabled="song.cp || !song.dl"
                @click="download(song)"
            ></Icon>
            <Icon type="more" clickable @click="showContextMenu(song)"></Icon>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex'

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
        download() {},
        showContextMenu() {},
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
