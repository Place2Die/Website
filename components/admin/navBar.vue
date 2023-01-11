<template>
    <div class="master-container">
        <div>
            <nuxt-link to="/">
                <figure class="image is-16by9">
                    <img src="~/assets/big.png" alt="">
                </figure>
            </nuxt-link>
        </div>
        <div class="menu">
            <p class="menu-label">
                General
            </p>
            <ul class="menu-list">
                <li>
                    <router-link :class="{ 'is-active': dashboard }" to="/admin">
                        Dashboard
                    </router-link>
                </li>
                <li>
                    <router-link :class="{ 'is-active': panel }" to="/admin/panel">
                        Panel
                    </router-link>
                </li>
            </ul>
            <p class="menu-label">
                Users
            </p>
            <ul class="menu-list">
                <li>
                    <router-link :class="{ 'is-active': users }" to="/admin/users">
                        Users
                    </router-link>
                </li>
                <li>
                    <router-link :class="{ 'is-active': ranks }" to="/admin/ranks">
                        Ranks
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>

const route = useRoute()

const dashboard = computed(() => {
    return route.path === '/admin'
})

const panel = computed(() => {
    return route.path === '/admin/panel'
})

const users = computed(() => {
    return route.path === '/admin/users'
})

const ranks = computed(() => {
    return route.path === '/admin/ranks'
})

</script>

<style lang="scss" scoped>

    .master-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        background-color: #0d1117;
        border-radius: 0 15px 0 0;
        padding-left: 1rem;
    }

</style>
