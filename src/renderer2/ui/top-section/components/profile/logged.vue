<template>
    <div :class="s.logged">
        <span @click="logout" :class="s.logout">退出账号</span>
    </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
    computed: {
        ...mapState('user/profile', ['avatar', 'nickname']),
    },
    methods: {
        ...mapActions('user', ['logout']),
    },
}
</script>
<style lang="scss" module="s">
.logged {
    .logout {
        font-size: 12px;
        cursor: pointer;
        &:hover {
            color: #26b36c;
        }
    }
}
</style>
