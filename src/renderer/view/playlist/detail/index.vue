<template>
    <div :class="s.detail" v-loading="loading">
        <div v-if="loading" style="height: 100%;"></div>
        <template v-else-if="list.length">
            <detail-header :title="info.name"
                           :cover="list[0].album.cover | image(list[0].vendor)"
                           play-text="播放全部"
                           @play="playAll(list)"
            >
                <p v-if="info.createdAt" :class="s.created">{{info.createdAt | date}} 创建</p>
                <template slot="btns">
                    <el-button @click="$router.push({ name: 'playlist.import', query: { offline: offline } })">
                        <Icon type="daoru"></Icon>
                        导入歌曲
                    </el-button>
                </template>
            </detail-header>
            <DataTable :data="list"
                       :class="s.table"
                       :pagination="false"
                       canSearch
            >
                <Icon slot="songControlAppend"
                      slot-scope="scope"
                      type="huishouzhan"
                      clickable
                      @click="removeFromPlaylist(scope.row)"
                ></Icon>
            </DataTable>
        </template>
        <div :class="s.noData" v-else>
            <Icon type="no-collect" :class="s.icon"></Icon>
            <p>还没有收藏歌曲</p>
            <p v-if="!offline">
                云平台有歌单？快来试试
                <router-link :to="{ name: 'playlist.import', query: { offline: offline } }"
                >
                    一键导入歌曲
                </router-link>
            </p>
            <p v-else>快去
                <router-link to="/rank">排行榜</router-link>
                看看吧
            </p>
        </div>
    </div>
</template>
<script src="./index.js"></script>
<style lang="scss" module="s">
    .detail {
        height: 100%;
        .created {
            color: $color-sub;
            margin-top: 4px;
            font-size: 13px;
        }
        .table {
            padding: 0 20px;
        }
        .noData {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            .icon {
                font-size: 100px;
                color: $color-disabled;
            }
            p {
                color: $color-sub;
                font-size: 12px;
                letter-spacing: 1px;
                margin-top: 4px;
            }
        }
    }
</style>