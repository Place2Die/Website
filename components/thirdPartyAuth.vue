<template>
    <div class="main-container">
        <button class="button has-icon-left is-outlined is-primary" @click="signInWithGoogle">
            <div class="icon is-small is-left">
                <i class="fab fa-google" />
            </div>
            <div>
                Sign in with Google
            </div>
        </button>
    </div>
</template>

<script setup>

defineProps({
    callback: {
        type: Function,
        default: null
    }
})

const signInWithGoogle = async () => {
    const credentials = await signInGoogle()
    if (credentials) {
        if (this.props.callback !== null) {
            this.props.callback()
        }
    }
}

</script>

<style lang="scss" scoped>

    .main-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

</style>
