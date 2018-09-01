<template>
    <div :class="s.artist"
         v-loading="loading"
    >
        <detail-header :title="detail.name"
                       :cover="detail.avatar | image(vendor)"
        >
            <p v-html="detail.desc"
               :class="s.detail"
            ></p>
        </detail-header>
        <DataTable :data="songs"
                   :class="s.table"
                   :showVendor="false"
        ></DataTable>
    </div>
</template>
<script src="./index.js"></script>
<style lang="scss" module="s">
    .artist {
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
        .table {
            width: 100%;
            padding: 0 20px;
        }
    }
</style>