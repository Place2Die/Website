<template>
    <div class="main-container">
        <button class="button has-icon-left is-outlined is-primary" @click="signInWithGoogle"> 
            <div class="icon is-small is-left">
                <i class="fab fa-google"></i>
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
        }
    })

    const signInWithGoogle = async () => {
        const credentials = await signInGoogle();
        if(credentials){
            if(callback){
                callback();
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