<template>
    <div :class="s.app">
        <div :class="s.left">
            <Icon type="left" :class="s.icon"></Icon>
            <Icon type="left" :class="[s.icon,s.right_arrow]"></Icon>
            <Icon type="shuaxin" :class="s.icon"></Icon>
            <div :class="s.inputArea">
                <input :class="s.input" v-model="key" @keyup.enter="search"/>
                <div :class="{[s.holder]:true,[s.empty]:empty}">
                    <Icon type="sousuo"></Icon>
                    <span v-show="empty">搜索</span>
                </div>
                <Icon type="close-2" :class="s.clean" v-show="!empty" @click.native="key = ''"></Icon>
            </div>
        </div>
    </div>
</template>
<script>
  export default {
    data () {
      return {
        key: ''
      }
    },
    computed: {
      empty () {
        return this.key.length < 1
      }
    },
    methods: {
      search () {
        this.$store.dispatch('api/search', {
          keywords: this.key
        })
        this.$router.push({name: 'searchResult'})
      }
    }
  }
</script>
<style lang="scss" module="s" src="./index.scss"></style>