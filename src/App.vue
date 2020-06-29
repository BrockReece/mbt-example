<template>
  <div id="app">
    <div v-if="state.matches('loading')">Loading...</div>
    <div v-else-if="state.matches('submitting')">Submitting...</div>
    <div v-else-if="state.matches('submitted')">
      Submitted: {{ form.emailAddress }}
    </div>
    <div v-else >
      <input ref="email" type="email" v-model="form.emailAddress" placeholder="Email address">
      <button @click="submit" :disabled="state.matches('ready') || state.matches('invalid')">Submit</button>
    </div>
  </div>
</template>

<script>
import { useMachine } from '@xstate/vue'
import { formMachine } from './stateMachines/form'

export default {
  setup() {
    const { state, send } = useMachine(formMachine, { devTools: true })
    return {
      state,
      send
    }
  },

  name: 'App',

  data() {
    return {
      form: {
        emailAddress: ''
      }
    }
  },

  computed: {
    validForm() {
      return !!(this.form.emailAddress && this.$refs.email.checkValidity())
    }
  },

  watch: {
    validForm(val) {
      this.send(val ? 'VALID_INPUT' : 'INVALID_INPUT')
    }
  },

  mounted() {
    setTimeout(() => {
      this.send('LOADED')
    }, 500)
  },

  methods: {
    submit() {
      this.send('SUBMIT_FORM')
      setTimeout(() => {
        this.send('SUCCESS')
      }, 500)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
