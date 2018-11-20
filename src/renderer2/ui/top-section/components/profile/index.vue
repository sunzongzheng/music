<template>
    <div :class="s.profile">
        <el-popover
            placement="bottom"
            trigger="click"
            :width="logged ? 135 : 160"
            :popper-class="s.popper"
        >
            <div slot="reference" :class="s.info">
                <img :src="avatar" v-if="logged" />
                <img
                    src="../../../../assets/user.png"
                    :class="s.unlogged"
                    v-else
                />
                <span :class="s.nickname">{{ nickname || '未登录' }}</span>
            </div>
            <logged v-if="logged"></logged> <unlogged v-else></unlogged>
        </el-popover>
    </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

import logged from './logged.vue'
import unlogged from './unlogged.vue'

export default {
    components: {
        logged,
        unlogged,
    },
    computed: {
        ...mapGetters('user', ['logged']),
        ...mapState('user/profile', ['avatar', 'nickname']),
    },
}
</script>
<style lang="scss" module="s">
.profile {
    display: flex;
    align-items: center;
    .info {
        display: flex;
        align-items: center;
        cursor: pointer;
        img {
            @include size(24px);
            border-radius: 50%;
        }
        .unlogged {
            background: #d6d6d6;
        }
        .nickname {
            color: #777;
            font-size: 12px;
            margin-left: 8px;
        }
    }
}

.popper {
    min-width: auto;
}
</style>
