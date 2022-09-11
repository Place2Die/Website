<template>
    <div>
        <div class="nav">
            <div v-if="!user" class="login">
                <nuxt-link to="/login">
                    <button class="button is-outlined">Login</button>
                </nuxt-link>
                <nuxt-link to="/register">
                    <button class="button is-primary">Register</button>
                </nuxt-link>
            </div>
            <div v-else>
                <button class="button is-warning" @click="signOutUser">Sign out</button>
            </div>
            <nuxt-link to="/admin" v-if="rank?.permissions?.admin_panel === true">
                <button class="button is-danger">Admin</button>
            </nuxt-link>
        </div>
    </div>
</template>
  
<script setup>

    import { signOutUser } from '~~/composables/useFirebase';

    const rank = useRank()
    const user = useFirebaseUser()

</script>

<style lang="scss" scoped>

    .nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;

        .login {
            display: flex;
            gap: 1rem;
        }
    }

</style>
