<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>

  onMounted(async () => {
    initUser();
  })
</script>

<style>
@import "https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css";
</style>