<template>
    <div :class="s.artists">
        <template v-for="artist in artists">
            <router-link
                v-if="artist.id"
                :to="{
                    name: 'artist.detail',
                    params: { id: artist.id },
                    query: { vendor: vendor },
                }"
            >
                {{ artist.name }}
            </router-link>
            <template v-else>
                {{ artist.name }}
            </template>
        </template>
    </div>
</template>
<script>
export default {
    props: {
        artists: Array,
        vendor: String,
    },
}
</script>
<style lang="scss" module="s">
.artists {
}
</style>
