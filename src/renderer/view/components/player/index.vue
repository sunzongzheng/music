<template>
    <div :class="s.main">
        <play-control></play-control>
        <play-info></play-info>
    </div>
</template>
<script src="./index.js"></script>
<style lang="scss" module="s" src="./index.scss"></style>
<style lang="scss" scoped>
    .playlist {
        list-style: none;
        .item {
            transition: all .2s;
            padding: 2px;
            cursor: pointer;
            user-select: none;
            &:hover {
                transition: all .2s;
                background-color: #f9f9f9;
            }
        }
    }
</style>