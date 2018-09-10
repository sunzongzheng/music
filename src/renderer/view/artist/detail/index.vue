<template>
    <div :class="s.artist" v-loading="loading">
        <div v-if="loading" style="height: 100%;"></div>
        <template v-else>
            <detail-header :title="detail.name"
                           :cover="detail.avatar | image(vendor)"
            >
                <p v-html="detail.desc"
                   :class="s.detail"
                ></p>
            </detail-header>
            <DataTable :data="songs"
                       :showVendor="false"
            ></DataTable>
        </template>
    </div>
</template>
<script src="./index.js"></script>
<style lang="scss" module="s">
    .artist {
        height: 100%;
        .detail {
            font-size: 12px;
            height: 88px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 5;
            -webkit-box-orient: vertical;
            margin: 12px 0 0;
            p {
                font-size: 12px;
                color: #222;
                margin: 0;
            }
            strong {
                display: none;
            }
        }
    }
</style>