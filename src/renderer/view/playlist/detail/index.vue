<template>
    <div :class="s.app">
        <div :class="s.top">
            <p :class="s.title">{{name}}</p>
            <router-link :to="{ name: 'playlist.import', query: { offline: offline } }"
                         v-if="!offline"
            >导入歌单歌曲
            </router-link>
        </div>
        <DataTable :data="list"
                   :loading="loading"
                   :class="s.table"
        >
            <Icon slot="songControlAppend"
                  slot-scope="scope"
                  type="huishouzhan"
                  @click="removeFromPlaylist(scope.row)"
            ></Icon>
        </DataTable>
    </div>
</template>
<script src="./index.js"></script>
<style lang="scss" module="s">
    .app {
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
            }
            a {
                color: $color-sub;
                font-size: 12px;
                line-height: 1;
                margin-left: 8px;
                text-decoration: none;
            }
        }
        .table {
            margin-top: 20px;
        }
    }
</style>