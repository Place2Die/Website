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

/* Tooltip container */
.tooltip {
    display: inline-block;
    position: relative;
}

/* Tooltip text */
.tooltip .tooltip-text {
    visibility: hidden;
    opacity: 0;
    width: 0;
    height: 0;
    background-color: #0d1117;
    color: #fff;
    text-align: center;
    padding: 5px;
    border-radius: 6px;
    align-items: center;
    justify-content: center;
    z-index: 1;
    position: absolute;
    transition: opacity 0.3s ease-in-out,
                height 0.2s ease-in-out;
    left: 110%;
    top: -10%;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
    width: fit-content;
    height: 2rem;
}
</style>
