import { Machine } from 'xstate'

export const formStates = {
    id: 'form',
    initial: 'loading',
    states: {
      loading: {
        on: {
          LOADED: 'ready'
        }
      },
      ready: {
        on: {
          VALID_INPUT: 'valid',
          INVALID_INPUT: 'invalid'
        }
      },
      invalid: {
        on: {
          VALID_INPUT: 'valid'  
        }
      },
      valid: {
        on: {
          INVALID_INPUT: 'invalid',
          SUBMIT_FORM: 'submitting'
        }
      },
      submitting: {
        on: {
          SUCCESS: 'submitted',
          ERROR: 'valid'
        }
      },
      submitted: {
        type: 'final'
      }
    }
  }

export const formMachine = Machine(formStates);