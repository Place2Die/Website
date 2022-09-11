<template>
  <div>
    <section class="hero is-primary is-fullheight  is-justify-content-center">
        <div class="section">
            <div class="columns">
                <div class="column is-4 is-offset-2">
                    <email-auth class="box px-5 py-5 mx-4" title="Login" :form="form" @submit="signin"/>
                </div>
                <div class="column is-4">
                    <third-party-auth class="box px-5 py-5 mx-4"/>
                </div>
            </div>
        </div>
    </section>
  </div>
</template>

<script setup>

    const form = ref({
        email: "",
        password: ""
    })

    const route = useRoute();

    const signin = async () => {
        const credentials = await signInUser(form.value.email, form.value.password)

        if(credentials){
            if(route.query.r){
                navigateTo(route.query.r)
            }
            else {
                navigateTo("/")
            }
            form.value = {
                email: "",
                password: ""
            }
        } else {
            form.value = {
                email: form.value.email,
                password: ""
            }
        }
    }

</script>

<style>

</style>