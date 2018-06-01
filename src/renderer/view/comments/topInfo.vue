<template>
    <div :class="s.topInfo" v-if="info.id">
        <img :src="info | defaultAlbum" :class="s.cover"/>
        <div :class="s.right">
            <p :class="s.name">{{info.name}}</p>
            <div :class="s.infoItem" style="margin-top: 12px;">
                <span :class="s.label">歌手：</span>
                <span v-for="item in info.artists" :class="s.text">{{item.name}}</span>
            </div>
            <div :class="s.infoItem">
                <span :class="s.label">专辑：</span>
                <span :class="s.text">{{info.album.name}}</span>
            </div>
        </div>
    </div>
</template>
<script>
  export default {
    props: {
      info: {
        type: Object,
        required: true
      }
    }
  }
</script>
<style lang="scss" module="s">
    .topInfo {
        display: flex;
        width: 100%;
        padding: 32px 24px;
        background-color: #FAFAFA;
        .cover {
            @include size(95px);
        }
        .right {
            padding-left: 24px;
            .name {
                font-size: 22px;
                font-weight: bold;
                margin: 0;
            }
            .infoItem {
                .label {
                    font-size: 14px;
                    color: $color-sub;
                }
                .text {
                    font-size: 14px;
                    color: $color-content;
                }
            }
        }
    }
</style>