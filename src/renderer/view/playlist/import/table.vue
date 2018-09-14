<template>
    <div :class="s.album_table">
        <div :class="s.top">
            <p :class="s.title">{{album.detail.name}}</p>
        </div>
        <DataTable :data="album.songs"
                   :spanWidth="spanWidth"
                   :showVendor="false"
                   slotAppendTitle="处理结果"
                   style="padding: 0"
        >
            <!-- 换源 !-->
            <replace-icon slot="songControlPrepend"
                          slot-scope="scope"
                          v-if="scope.row.cp"
                          :info="scope.row"
                          @replace="replaceSong($event, scope.$index)"
            ></replace-icon>
            <!-- 删除 !-->
            <Icon slot="songControlAppend"
                  slot-scope="scope"
                  type="huishouzhan"
                  clickable
                  @click="removeFromPlaylist(scope.$index)"
            ></Icon>
            <!-- 处理结果 !-->
            <div slot="append"
                 slot-scope="scope"
            >
                <p :class="{ [s.result] : true, [s.success]: scope.row.status }" v-if="scope.row.status > -1">
                    {{scope.row.status ? '成功' : `失败: ${scope.row.msg}`}}
                </p>
            </div>
        </DataTable>
    </div>
</template>
<script>
    import {mapActions} from 'vuex'
    import replaceIcon from './replaceIcon.vue'

    export default {
        components: {
            replaceIcon,
        },
        props: {
            album: Object
        },
        data() {
            return {
                spanWidth: [8, 7, 4, 0, 5]
            }
        },
        methods: {
            ...mapActions('play', ['play']),
            async removeFromPlaylist(index) {
                this.album.songs.splice(index, 1)
            },
            // 替换歌曲
            replaceSong(item, index) {
                this.album.songs.splice(index, 1, item)
            }
        }
    }
</script>
<style lang="scss" module="s">
    .album_table {
        .top {
            display: flex;
            width: 100%;
            height: 30px;
            align-items: flex-end;
            .title {
                font-size: 20px;
                color: #191919;
                margin: 0;
                line-height: 1;
                padding-left: 12px;
                position: relative;
                &::before {
                    content: ' ';
                    background: $color-primary;
                    width: 2px;
                    height: 100%;
                    position: absolute;
                    left: 0;
                    top: 0;
                }
            }
            a {
                color: $color-sub;
                font-size: 12px;
                line-height: 1;
                margin-left: 8px;
                text-decoration: none;
            }
        }
        .result {
            color: #F56C6C;
            margin: 0;
            &.success {
                color: $color-primary;
            }
        }
    }
</style>