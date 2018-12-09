<template>
    <detail-page
        :class="s.playlistDetail"
        :createdBy="nickname"
        :createdAt="info.createdAt"
        :name="info.name"
        :cover="info.cover"
    >
        <data-table
            slot="table"
            :data="list"
            :loading="loading.getPlaylistSong"
        ></data-table>
    </detail-page>
</template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
    data() {
        return {
            list: [],
            loading: {
                getPlaylistSong: false,
            },
        }
    },
    computed: {
        ...mapGetters('user/playlist', ['playlistObject']),
        ...mapState('user/profile', ['nickname']),
        type() {
            return this.$route.params.type
        },
        id() {
            return this.$route.params.id
        },
        info() {
            return this.playlistObject[this.type][this.id] || {}
        },
    },
    watch: {
        $route: 'init',
    },
    methods: {
        ...mapActions('user/playlist', ['getPlaylistSong']),
        async init() {
            this.loading.getPlaylistSong = true
            try {
                this.list = await this.getPlaylistSong({
                    id: this.id,
                    type: this.type,
                })
                console.log(this.list)
            } catch (e) {}
            this.loading.getPlaylistSong = false
        },
    },
    created() {
        this.init()
    },
}
</script>
<style lang="scss" module="s">
.playlistDetail {
    padding-bottom: 12px;
    .info {
        padding: 4px 12px;
        flex: 1;
    }
}
</style>
