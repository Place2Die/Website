<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup>

onMounted(async () => {
    await initUser()
})

</script>

<style>
@import "https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css";

html::-webkit-scrollbar {
    display: none;
}
</style>
