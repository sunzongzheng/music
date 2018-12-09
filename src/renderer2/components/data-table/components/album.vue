<template>
    <router-link
        v-if="album.id"
        :to="{
            name: 'album.detail',
            params: { id: album.id },
            query: { vendor: vendor },
        }"
    >
        {{ album.name }}
    </router-link>
    <span v-else> {{ album.name }} </span>
</template>
<script>
export default {
    props: {
        album: Object,
        vendor: String,
    },
}
</script>
