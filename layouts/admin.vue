<template>
  <div class="layout-container">
    <div id="layout-left">
        <admin-navbar />
    </div>
    <div id="layout-right">
        <slot />
    </div>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
    .layout-container {
        display: grid;
        position: absolute;
        grid-template-columns: 1fr 4fr;
        height: 100%;
        width: 100%;
        background-color: #161b22;

        #layout-left {
            width: 100%;
            height: 100%;
        }

        #layout-right {
            width: 100%;
            height: 100%;
        }
    }
</style>