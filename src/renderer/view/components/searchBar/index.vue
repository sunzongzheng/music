<template>
    <div :class="s.app">
        <div :class="s.left">
            <Icon type="left" :class="s.icon" @click="$router.go(-1)"></Icon>
            <Icon type="left" :class="[s.icon,s.right_arrow]" @click="$router.go(1)"></Icon>
            <Icon type="shuaxin" :class="s.icon" @click="refresh"></Icon>
            <div :class="s.inputArea">
                <input :class="s.input"
                       v-model="key"
                       @keyup.enter="search"
                       @compositionstart="ime = true"
                       @compositionend="ime = false"
                       ref="input"
                />
                <div :class="{[s.holder]:true,[s.empty]:empty}">
                    <Icon type="sousuo" :class="s.searchIcon"></Icon>
                    <span v-show="empty && !ime">搜索</span>
                </div>
                <Icon type="close-2" :class="s.clean" v-show="!empty" @click.native="key = ''"></Icon>
            </div>
        </div>
        <div :class="s.right">
            <Icon type="download" :class="s.icon" @click="$router.push('/download')"></Icon>
            <Icon type="shezhi" :class="s.icon" @click="$router.push('/setting')"></Icon>
        </div>
    </div>
</template>
<script>
    import eventBus from '@/eventBus/searchResult'

    export default {
        data() {
            return {
                key: '',
                ime: false
            }
        },
        computed: {
            empty() {
                return this.key.length < 1
            }
        },
        methods: {
            async search() {
                if (this.empty) {
                    return
                }
                this.$store.commit('search/update', {
                    keywords: this.key,
                    loading: true,
                })
                eventBus.searchResult = []
                this.$router.push({name: 'searchResult'})
                let data = await this.$musicApi.searchSong(this.key)
                if (data.status) {
                    eventBus.searchResult = data.data.filter(item => item.id).map(item => {
                        return {
                            ...item,
                            songId: item.id
                        }
                    })
                    this.$store.commit('search/update', {
                        loading: false
                    })
                } else {
                    console.warn(data)
                    this.$message.warning(data.msg)
                }
            },
            refresh() {
                eventBus.$emit('refresh')
            },
            focus() {
                this.$refs.input && this.$refs.input.focus()
            }
        },
        created() {
            eventBus.$on('focus', this.focus)
        },
        beforeRouteLeave(to, from ,next) {
            eventBus.$off('focus', this.focus)
            next()
        }
    }
</script>
<style lang="scss" module="s" src="./index.scss"></style>