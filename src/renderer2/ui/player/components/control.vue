<template>
    <div :class="s.control">
        <Icon
            :type="`cycle-${cycle}`"
            :class="[s.icon, s.cycle]"
            clickable
            @click="toggleCycle"
        ></Icon>
        <Icon
            type="last"
            :class="[s.icon, s.last]"
            clickable
            @click="last"
        ></Icon>
        <Icon
            :type="pause ? 'play' : 'pause'"
            :class="[s.icon, s.play]"
            clickable
            @click="togglePause"
        ></Icon>
        <Icon
            type="next"
            :class="[s.icon, s.next]"
            clickable
            @click="next(true)"
        ></Icon>
        <Icon
            type="collect"
            :class="[s.icon, s.collect]"
            clickable
            v-popover:playlist
        ></Icon>
        <el-popover
            placement="top"
            trigger="click"
            ref="playlist"
            :popper-class="s.popover"
            v-model="show"
        >
            <template v-if="online.length || offline.length">
                <template v-if="online.length">
                    <p :class="s.title">云歌单</p>
                    <ul :class="s.playlist">
                        <li
                            v-for="item in online"
                            @click="_collect(item.id, 'online')"
                        >
                            {{ item.name }}
                        </li>
                    </ul>
                </template>
                <template v-if="offline.length">
                    <p :class="s.title">离线歌单</p>
                    <ul :class="s.playlist">
                        <li
                            v-for="item in offline"
                            @click="_collect(item.id, 'offline')"
                        >
                            {{ item.name }}
                        </li>
                    </ul>
                </template>
            </template>
            <template v-else
                >暂无歌单</template
            >
        </el-popover>
    </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
    data() {
        return {
            show: false,
        }
    },
    computed: {
        ...mapState('audio', ['pause']),
        ...mapState('playing', ['cycle']),
        ...mapState('user/playlist/online', {
            online: 'list',
        }),
        ...mapState('user/playlist/offline', {
            offline: 'list',
        }),
        ...mapGetters('user', ['logged']),
    },
    methods: {
        ...mapActions('audio', ['togglePause', 'next', 'last']),
        ...mapActions('playing', ['next', 'last', 'toggleCycle']),
        ...mapActions('user/playlist', ['collect']),
        async _collect(id, type) {
            try {
                await this.collect({
                    id,
                    type,
                })
                this.show = false
            } catch (e) {}
        },
    },
}
</script>
<style lang="scss" module="s">
.control {
    display: flex;
    align-items: center;
    .icon {
        font-size: 30px;
        margin-right: 24px;
        color: #555;
        &:hover {
            color: $color-primary;
        }
    }
    .play {
        font-size: 40px;
        transition: transform 0.2s;
        &:hover {
            transform: scale(1.05);
        }
    }
    .cycle,
    .collect {
        font-size: 26px;
    }
}

.popover {
    .title {
        font-size: 12px;
        color: #8f8f8f;
        margin: 0;
    }

    .playlist {
        list-style: none;
        margin-bottom: 4px;
        li {
            padding: 4px 8px;
            cursor: pointer;
            &:hover {
                background-color: rgba(245, 245, 245, 0.49);
            }
        }
    }
}
</style>
