<template>
    <div>
      <section class="hero is-primary is-fullheight  is-justify-content-center">
          <div class="section">
              <div class="columns">
                  <div class="column is-4 is-offset-2">
                        <div class="box px-5 py-5 mx-4">
                            <h2 class="mb-5 title is-4 has-text-black">Register</h2>
                            <div class="label">
                                <label class="label">Email</label>
                                <div class="control has-icons-left has-icons-right">
                                    <input class="input" type="email"
                                    placeholder="john@gmail.com"
                                    v-model="form.email"
                                    @input="checkEmail"
                                    />
                                    <span class="icon is-small is-left">
                                    <i class="fas fa-envelope"></i>
                                    </span>
                                </div>
                            </div>
                            <div class="label">
                                <label class="label">Password</label>
                                <div class="control has-icons-left has-icons-right">
                                    <input class="input" type="password"
                                    placeholder="****************"
                                    v-model="form.password"
                                    v-on:keyup.enter="submit"
                                    @input="checkPassword"
                                    />
                                    <span class="icon is-small is-left">
                                    <i class="fas fa-lock"></i>
                                    </span>
                                </div>
                            </div>
                            <div class="label">
                                <label class="label">Confirm Password</label>
                                <div class="control has-icons-left has-icons-right">
                                    <input class="input" type="password"
                                    placeholder="****************"
                                    v-model="form.confirm_password"
                                    @input="checkPassword"
                                    />
                                    <span class="icon is-small is-left">
                                    <i class="fas fa-lock"></i>
                                    </span>
                                </div>
                            </div>

                            <div v-if="success_message" class="has-text-success p-3">
                                {{success_message}}
                            </div>
                            <div v-if="error_message" class="has-text-danger p-3 has-icon-left">
                                <i class="fas fa-triangle-exclamation"></i>
                                {{error_message}}
                            </div>

                            <button class="button is-success has-icons-left" @click="register">
                            <div class="icon is-small is-left">
                                <i class="fas fa-paper-plane"></i>
                            </div>
                            <div>
                                Submit
                            </div>
                            </button>
                        </div>
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
          password: "",
          confirm_password: ""
      })

      const route = useRoute();
  
      const success_message = ref("")
      const error_message = ref("")

      const register = async () => {

        if(error_message.value){
            return;
        }

        if(form.value.password != form.value.confirm_password){
            error_message.value = "Passwords do not match"
            return;
        }
        if(form.value.password.length < 6){
            error_message.value = "Password must be at least 6 characters"
            return;
        }

        const result = await createUser(form.value.email, form.value.password)

        if(!result.error_message){
            success_message.value = "Account created successfully"
            setTimeout(() => {
                success_message.value = ""
                if(route.query.r){
                    navigateTo(route.query.r)
                } else {
                    navigateTo("/")
                }
            }, 3000)
        } else {
            form.value = {
                email: form.value.email,
                password: "",
                confirm_password: ""
            }
            if(result.code === "auth/email-already-in-use"){
                error_message.value = "User already exists with this email"
            } else {
                error_message.value = result.code
            }
        }
      }

      const checkPassword = () => {

        if(form.value.password === "" || form.value.confirm_password === ""){
            error_message.value = ""
            return;
        }

        if(form.value.password !== form.value.confirm_password){
            error_message.value = "Passwords do not match"
        } 
        else if(form.value.password.length < 6){
            error_message.value = "Password must be at least 6 characters"
        }
        else {
            error_message.value = ""
        }
      }

      const checkEmail = () => {
        if(form.value.email === ""){
            error_message.value = ""
            return;
        }

        const regex = new RegExp(".+@.+\\..{2,}")

        if(!regex.test(form.value.email)){
            error_message.value = "Invalid email"
        } else {
            error_message.value = ""
        }
      }
  
  </script>
  
  <style>
  
  </style>