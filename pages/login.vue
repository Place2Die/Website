<template>
  <div>
    <section class="hero is-primary is-fullheight  is-justify-content-center">
      <div class="section">
        <div class="columns">
          <div class="column is-4 is-offset-2">
            <div class="box px-5 py-5 mx-4">
              <h2 class="mb-5 title is-4 has-text-black">
                Login
              </h2>
              <div class="field">
                <div class="label">
                  <label class="label">Email</label>
                  <div class="control has-icons-left has-icons-right">
                    <input
                      v-model="form.email"
                      class="input"
                      type="email"
                      placeholder="john@gmail.com"
                      :class="{ 'is-danger': emailError, 'is-success': emailSuccess }"
                      @input="checkEmail"
                    >
                    <span class="icon is-small is-left">
                      <i class="fas fa-envelope" />
                    </span>
                  </div>
                </div>
                <p v-if="emailError" class="help is-danger">
                  {{ emailErrorMessage }}
                </p>
                <p v-if="emailSuccess" class="help is-success">
                  {{ emailSuccessMessage }}
                </p>
              </div>
              <div class="field">
                <div class="label">
                  <label class="label">Password</label>
                  <div class="control has-icons-left has-icons-right">
                    <input
                      v-model="form.password"
                      class="input"
                      type="password"
                      placeholder="****************"
                      :class="{ 'is-danger': passwordError }"
                      @keyup.enter="submit"
                      @input="checkPassword"
                    >
                    <span class="icon is-small is-left">
                      <i class="fas fa-lock" />
                    </span>
                  </div>
                </div>
                <p v-if="passwordError" class="help is-danger">
                  {{ passwordErrorMessage }}
                </p>
              </div>
              <div v-if="successMessage" class="has-text-success p-3 icon-text">
                <i class="icon fas fa-check" />
                {{ successMessage }}
              </div>
              <!-- div v-if="error_message" class="has-text-danger p-3 icon-text">
                                <i class="icon fas fa-triangle-exclamation"></i>
                                {{error_message}}
                            </div -->

              <button
                class="button is-success has-icons-left"
                :disabled="submitDisabled"
                @click="signin"
              >
                <div class="icon is-small is-left">
                  <i class="fas fa-paper-plane" />
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
    email: '',
    password: ''
})

const route = useRoute()

const successMessage = ref('')
const passwordErrorMessage = ref('')
const passwordError = ref(false)
const emailErrorMessage = ref('')
const emailError = ref(false)
const emailSuccessMessage = ref('')
const emailSuccess = ref(false)

const submitDisabled = ref(true)

const signin = async () => {
    if (submitDisabled.value) { return }

    if (form.value.password.length < 6) {
        passwordErrorMessage.value = 'Password must be at least 6 characters'
        passwordError.value = true
        return
    }

    const result = await signInUser(form.value.email, form.value.password)

    if (!result.error_message) {
        successMessage.value = 'Login successful'
        setTimeout(() => {
            successMessage.value = ''
            if (route.query.r) {
                navigateTo(route.query.r)
            } else {
                navigateTo('/')
            }
        }, 2000)
    } else {
        form.value = {
            email: form.value.email,
            password: ''
        }
        if (result.code === 'auth/wrong-password') {
            password_.value = 'Wrong password'
            passwordError.value = true
        } else if (result.code === 'auth/user-not-found') {
            emailErrorMessage.value = 'User not found'
            emailError.value = true
        } else {
            emailErrorMessage.value = result.code
            emailError.value = true
        }
    }

    checkForm()
}

const checkForm = () => {
    if ((emailError.value || passwordError.value) || (form.value.email === '' || form.value.password === '')) {
        submitDisabled.value = true
    } else {
        submitDisabled.value = false
    }
}

const checkPassword = () => {
    if (form.value.password === '') {
        passwordErrorMessage.value = ''
        passwordError.value = false
    } else if (form.value.password.length < 6) {
        passwordErrorMessage.value = 'Password must be at least 6 characters'
        passwordError.value = true
    } else {
        passwordErrorMessage.value = ''
        passwordError.value = false
    }

    checkForm()
}

const checkEmail = () => {
    if (form.value.email === '') {
        emailErrorMessage.value = ''
        emailError.value = false
        emailSuccessMessage.value = ''
        emailSuccess.value = false
        return
    }

    const regex = /.+@.+\..{2,}/

    if (!regex.test(form.value.email)) {
        emailErrorMessage.value = 'Invalid email'
        emailError.value = true
        emailSuccessMessage.value = ''
        emailSuccess.value = false
    } else {
        emailErrorMessage.value = ''
        emailError.value = false

        doesEmailExist(form.value.email).then((result) => {
            if (!result) {
                emailErrorMessage.value = 'No user exists with this email'
                emailError.value = true
                emailSuccessMessage.value = ''
                emailSuccess.value = false
            } else {
                emailSuccessMessage.value = ''
                emailSuccess.value = true
            }
        })
    }
    checkForm()
}

</script>

<style>

</style>
