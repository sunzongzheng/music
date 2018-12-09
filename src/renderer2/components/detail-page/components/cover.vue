<template>
    <div :class="s.cover">
        <img :src="src | image(290)" :class="s.coverImage" />
        <img src="../images/album_cover.png" :class="s.coverAttach" />
    </div>
</template>
<script>
export default {
    props: {
        src: String,
    },
}
</script>
<style lang="scss" module="s">
.cover {
    position: relative;
    padding-right: 19px;
    font-size: 0;
    &Image {
        @include size(145px);
    }
    &Attach {
        position: absolute;
        left: 0;
        top: 0;
        @include size(100%);
    }
}
</style>
