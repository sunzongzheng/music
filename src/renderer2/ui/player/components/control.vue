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
        <Icon type="collect" :class="[s.icon, s.collect]" clickable></Icon>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
    computed: {
        ...mapState('audio', ['pause']),
        ...mapState('playing', ['cycle']),
    },
    methods: {
        ...mapActions('audio', ['togglePause', 'next', 'last']),
        ...mapActions('playing', ['next', 'last', 'toggleCycle']),
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
</style>
