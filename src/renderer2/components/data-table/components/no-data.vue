<template>
    <div :class="s.nodata">
        <Icon type="wushuju" :class="s.icon"></Icon>
        <p>暂无数据~</p>
    </div>
</template>
<style lang="scss" module="s">
.nodata {
    display: flex;
    width: 100%;
    min-height: 200px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .icon {
        font-size: 100px;
    }
    p {
        margin: 0;
    }
}
</style>
