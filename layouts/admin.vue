<template>
    <div class="layout-container">
        <div id="layout-left">
            <admin-nav-bar />
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
        height: 100%;
        width: 100%;
        overflow: hidden;

        #layout-left {
            position: fixed;
            width: 20%;
            height: 100%;
            top: 0;
            left: 0;
            background-color: #161b22;
        }

        #layout-right {
            position: fixed;
            width: 80%;
            height: 100%;
            top: 0;
            right: 0;
            background-color: #161b22;
            overflow-y: auto;
        }

        #layout-right::-webkit-scrollbar {
            width: 12px;
        }
        #layout-right::-webkit-scrollbar-track {
            background: #161b22;
            padding: 0 10px;
        }
        #layout-right::-webkit-scrollbar-thumb {
            background-color: #0d1117;
            border-radius: 20px;
            border: 3px solid #161b22;
        }
    }
</style>
