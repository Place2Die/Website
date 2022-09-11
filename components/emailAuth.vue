<template>
  <div>
    <h2 class="mb-5 title is-4 has-text-black">{{title}}</h2>
    <div class="label">
      <label class="label">Email</label>
      <div class="control has-icons-left has-icons-right">
        <input class="input" type="email"
          placeholder="john@gmail.com"
          v-model="form.email"
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
        />
        <span class="icon is-small is-left">
          <i class="fas fa-lock"></i>
        </span>
      </div>
    </div>

    <div v-if="success_message" class="has-text-success p-3">
      {{success_message}}
    </div>

    <button class="button is-success has-icons-left" @click="$emit('submit')">
      <div class="icon is-small is-left">
        <i class="fas fa-paper-plane"></i>
      </div>
      <div>
        Submit
      </div>
    </button>
  </div>
</template>

<script setup>

  const props = defineProps({
    title: {
      type: String,
      required: true
    },
    success_message: {
      type: String
    },
    form: {
      type: Object,
      required: true
    }
  })

</script>

<style>

</style>