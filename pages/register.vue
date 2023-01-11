<template>
  <div>
    <section class="hero is-primary is-fullheight  is-justify-content-center">
      <div class="section">
        <div class="columns">
          <div class="column is-4 is-offset-2">
            <div class="box px-5 py-5 mx-4">
              <h2 class="mb-5 title is-4 has-text-black">
                Register
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
                <div class="label">
                  <label class="label">Confirm Password</label>
                  <div class="control has-icons-left has-icons-right">
                    <input
                      v-model="form.confirm_password"
                      class="input"
                      type="password"
                      placeholder="****************"
                      :class="{ 'is-danger': passwordError }"
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
                <progress
                  class="progress is-small"
                  :class="{ 'is-primary': passwordScore > 75,
                            'is-warning': passwordScore > 50 && passwordScore <= 75,
                            'is-danger': passwordScore <= 50 }"
                  :value="passwordScore"
                  max="100"
                />
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
                @click="register"
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
    password: '',
    confirm_password: ''
})

const route = useRoute()

const successMessage = ref('')
const passwordErrorMessage = ref('')
const passwordError = ref(false)
const emailErrorMessage = ref('')
const emailError = ref(false)
const emailSuccessMessage = ref('')
const emailSuccess = ref(false)
const passwordScore = ref(0)

const submitDisabled = ref(true)

const register = async () => {
    if (submitDisabled.value) { return }

    if (form.value.password !== form.value.confirm_password) {
        passwordErrorMessage.value = 'Passwords do not match'
        passwordError.value = true
        return
    }
    if (form.value.password.length < 6) {
        passwordErrorMessage.value = 'Password must be at least 6 characters'
        passwordError.value = true
        return
    }

    const result = await createUser(form.value.email, form.value.password)

    if (!result.error_message) {
        successMessage.value = 'Account created successfully'
        setTimeout(() => {
            successMessage.value = ''
            if (route.query.r) {
                navigateTo(route.query.r)
            } else {
                navigateTo('/')
            }
        }, 3000)
    } else {
        form.value = {
            email: form.value.email,
            password: '',
            confirm_password: ''
        }
        if (result.code === 'auth/email-already-in-use') {
            emailErrorMessage.value = 'User already exists with this email'
            emailError.value = true
        } else {
            emailErrorMessage.value = result.code
            emailError.value = true
        }
    }

    checkForm()
}

const checkForm = () => {
    submitDisabled.value = !!((emailError.value || passwordError.value) || (form.value.email === '' || form.value.password === ''))
}

const checkPassword = () => {
    passwordScore.value = scorePassword(form.value.password)
    if (form.value.password === '') {
        passwordErrorMessage.value = ''
        passwordError.value = false
    } else if (form.value.password !== form.value.confirm_password) {
        passwordErrorMessage.value = 'Passwords do not match'
        passwordError.value = true
    } else if (form.value.password.length < 6) {
        passwordErrorMessage.value = 'Password must be at least 6 characters'
        passwordError.value = true
    } else {
        passwordErrorMessage.value = ''
        passwordError.value = false
    }

    checkForm()
}

function scorePassword (pass) {
    let score = 0
    if (!pass) { return score }

    // award every unique letter until 5 repetitions
    const letters = {}
    for (let i = 0; i < pass.length; i++) {
        letters[pass[i]] = (letters[pass[i]] || 0) + 1
        score += 5.0 / letters[pass[i]]
    }

    // bonus points for mixing it up
    const variations = {
        digits: /\d/.test(pass),
        lower: /[a-z]/.test(pass),
        upper: /[A-Z]/.test(pass),
        nonWords: /\W/.test(pass)
    }

    let variationCount = 0
    for (const check in variations) {
        variationCount += (variations[check] === true) ? 1 : 0
    }
    score += (variationCount - 1) * 10

    return score
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
            if (result) {
                emailErrorMessage.value = 'User already exists with this email'
                emailError.value = true
                emailSuccessMessage.value = ''
                emailSuccess.value = false
            } else {
                emailSuccessMessage.value = 'Email is available'
                emailSuccess.value = true
            }
        })
    }
}

</script>

<style>

</style>
