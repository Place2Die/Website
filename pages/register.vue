<template>
    <div>
        <section class="hero is-primary is-fullheight  is-justify-content-center">
            <div class="section">
                <div class="columns">
                    <div class="column is-4 is-offset-2">
                        <div class="box px-5 py-5 mx-4">
                            <h2 class="mb-5 title is-4 has-text-black">Register</h2>
                            <div class="field">
                                <div class="label">
                                    <label class="label">Email</label>
                                    <div class="control has-icons-left has-icons-right">
                                        <input class="input" type="email" placeholder="john@gmail.com"
                                            v-model="form.email" @input="checkEmail"
                                            v-bind:class="{ 'is-danger': email_error, 'is-success': email_success }" />
                                        <span class="icon is-small is-left">
                                            <i class="fas fa-envelope"></i>
                                        </span>
                                    </div>
                                </div>
                                <p class="help is-danger" v-if="email_error">{{ email_error_message }}</p>
                                <p class="help is-success" v-if="email_success">{{ email_success_message }}</p>
                            </div>
                            <div class="field">
                                <div class="label">
                                    <label class="label">Password</label>
                                    <div class="control has-icons-left has-icons-right">
                                        <input class="input" type="password" placeholder="****************"
                                            v-model="form.password" v-on:keyup.enter="submit" @input="checkPassword"
                                            v-bind:class="{ 'is-danger': password_error }" />
                                        <span class="icon is-small is-left">
                                            <i class="fas fa-lock"></i>
                                        </span>
                                    </div>
                                </div>
                                <div class="label">
                                    <label class="label">Confirm Password</label>
                                    <div class="control has-icons-left has-icons-right">
                                        <input class="input" type="password" placeholder="****************"
                                            v-model="form.confirm_password" @input="checkPassword"
                                            v-bind:class="{ 'is-danger': password_error }" />
                                        <span class="icon is-small is-left">
                                            <i class="fas fa-lock"></i>
                                        </span>
                                    </div>
                                </div>
                                <p class="help is-danger" v-if="password_error">{{ password_error_message }}</p>
                                <progress class="progress is-small" v-bind:class="{ 'is-primary': password_score > 75,
                                'is-warning': password_score > 50 && password_score <= 75,
                                'is-danger': password_score <= 50 }" :value="password_score" max="100">
                                </progress>
                            </div>
                            <div v-if="success_message" class="has-text-success p-3 icon-text">
                                <i class="icon fas fa-check"></i>
                                {{success_message}}
                            </div>
                            <div v-if="error_message" class="has-text-danger p-3 icon-text">
                                <i class="icon fas fa-triangle-exclamation"></i>
                                {{error_message}}
                            </div>

                            <button class="button is-success has-icons-left" 
                                :disabled="submit_disabled" @click="register">
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
                        <third-party-auth class="box px-5 py-5 mx-4" />
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
const password_error_message = ref("")
const password_error = ref(false)
const email_error_message = ref("")
const email_error = ref(false)
const email_success_message = ref("")
const email_success = ref(false)
const password_score = ref(0)

const submit_disabled = ref(true)

const register = async () => {

    if(submit_disabled.value) return

    if (form.value.password != form.value.confirm_password) {
        password_error_message.value = "Passwords do not match"
        password_error.value = true
        return;
    }
    if (form.value.password.length < 6) {
        password_error_message.value = "Password must be at least 6 characters"
        password_error.value = true
        return;
    }

    const result = await createUser(form.value.email, form.value.password)

    if (!result.error_message) {
        success_message.value = "Account created successfully"
        setTimeout(() => {
            success_message.value = ""
            if (route.query.r) {
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
        if (result.code === "auth/email-already-in-use") {
            email_error_message.value = "User already exists with this email"
            email_error.value = true
        } else {
            email_error_message.value = result.code
            email_error.value = true
        }
    }

    checkForm()
}

const checkForm = () => {
    if((email_error.value || password_error.value) || (form.value.email === "" || form.value.password === "")) {
        submit_disabled.value = true
    } else {
        submit_disabled.value = false
    }
}

const checkPassword = () => {
    password_score.value = scorePassword(form.value.password);
    if (form.value.password === "") {
        password_error_message.value = ""
        password_error.value = false
    } else {
        if (form.value.password !== form.value.confirm_password) {
        password_error_message.value = "Passwords do not match"
        password_error.value = true
        }
        else if (form.value.password.length < 6) {
            password_error_message.value = "Password must be at least 6 characters"
            password_error.value = true
        }
        else {
            password_error_message.value = ""
            password_error.value = false
        }
    }

    
    checkForm()
}


function scorePassword(pass) {
    var score = 0;
    if (!pass) return score;

    // award every unique letter until 5 repetitions
    var letters = new Object();
    for (var i = 0; i < pass.length; i++) {
        letters[pass[i]] = (letters[pass[i]] || 0) + 1;
        score += 5.0 / letters[pass[i]];
    }

    // bonus points for mixing it up
    var variations = {
        digits: /\d/.test(pass),
        lower: /[a-z]/.test(pass),
        upper: /[A-Z]/.test(pass),
        nonWords: /\W/.test(pass),
    }

    var variationCount = 0;
    for (var check in variations) {
        variationCount += (variations[check] == true) ? 1 : 0;
    }
    score += (variationCount - 1) * 10;

    return parseInt(score);
}

const checkEmail = () => {
    if (form.value.email === "") {
        email_error_message.value = ""
        email_error.value = false
        email_success_message.value = ""
        email_success.value = false
        return;
    }

    const regex = new RegExp(".+@.+\\..{2,}")

    if (!regex.test(form.value.email)) {
        email_error_message.value = "Invalid email"
        email_error.value = true
        email_success_message.value = ""
        email_success.value = false
    } else {
        email_error_message.value = ""
        email_error.value = false

        doesEmailExist(form.value.email).then((result) => {
            if (result) {
                email_error_message.value = "User already exists with this email"
                email_error.value = true
                email_success_message.value = ""
                email_success.value = false
            } else {
                email_success_message.value = "Email is available"
                email_success.value = true
            }
        })
    }
}

</script>
  
<style>

</style>