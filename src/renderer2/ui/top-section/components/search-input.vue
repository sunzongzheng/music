<template>
    <div :class="s.searchInput">
        <input
            :class="s.input"
            v-model="keyword"
            @keyup.enter="search"
            @compositionstart="ime = true"
            @compositionend="ime = false"
            ref="input"
        />
        <div :class="{ [s.holder]: true, [s.empty]: empty }">
            <Icon type="search" :class="s.searchIcon"></Icon>
            <span v-show="empty && !ime">搜索</span>
        </div>
        <Icon
            type="close-2"
            :class="s.clean"
            v-show="!empty"
            @click.native="keyword = ''"
        ></Icon>
    </div>
</template>
<script>
export default {
    data() {
        return {
            keyword: '',
            ime: false,
        }
    },
    computed: {
        empty() {
            return this.keyword.length < 1
        },
    },
    methods: {
        async search() {
            if (this.empty) {
                return
            }
            this.$router.push({
                name: 'search-result',
                query: {
                    keyword: this.keyword
                }
            })
        },
    },
}
</script>
<style lang="scss" module="s">
.searchInput {
    position: relative;
    .input {
        width: 200px;
        height: 20px;
        border-radius: 20px;
        border: none;
        background-color: #eaeaea;
        margin-left: 16px;
        padding: 0 22px;
        opacity: 0.7;
        position: relative;
        z-index: 1;
        font-size: 12px;
        &:focus {
            outline: none;
        }
    }
    .input:focus + .holder {
        left: 20px;
        margin: 0;
        transition: all 0.4s;
    }
    .holder {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        width: 44px;
        padding: 0 2px;
        position: absolute;
        left: 20px;
        top: 0;
        bottom: 0;
        margin: 0;
        transition: all 0.4s;
        &.empty {
            left: 92px;
            margin: auto;
        }
        span {
            line-height: 1;
        }
    }
    .clean {
        position: absolute;
        right: 3px;
        top: 0;
        bottom: 0;
        margin: auto;
        cursor: pointer;
        z-index: 2;
        opacity: 0.5;
    }
}
</style>
