
import { Machine } from 'xstate'
import { createModel } from '@xstate/test'
import { defaultsDeep } from 'lodash'

import { formStates } from '../../src/stateMachines/form'

let email = ''
const LOADING_TIME = 2000

const formMachine = Machine(defaultsDeep({
    states: {
        loading: {
            meta: {
                test(cy) {
                    cy.contains('Loading')
                }
            }
        },
        ready: {
            meta: {
                test(cy) {
                    cy.get('input', { timeout: LOADING_TIME })
                }
            }
        },
        invalid: {
            meta: {
                test(cy) {
                    cy.get('button').should('be.disabled')
                }
            }
        },
        valid: {
            meta: {
                test(cy) {
                    cy.get('button').should('not.be.disabled')
                }
            }
        },
        submitting: {
            meta: {
                test(cy) {
                    cy.contains('Submitting')
                }
            }
        },
        submitted: {
            meta: {
                test(cy) {
                    cy.contains('Submitted')
                    cy.contains(email)
                }
            }
        }
    }
}, formStates))

const formModel = createModel(formMachine).withEvents({
    VALID_INPUT: { 
        cases: [{ email: 'test@test.com' }, { email: 'foo@bar.com' }],
        exec: (cy, event) => {
            email = event.email
            cy.get('input')
                .clear()
                .type(event.email)
        }
    },
    INVALID_INPUT: {
        cases: [{ email: 'test@test.' }, { email: '' }],
        exec: (cy, event) => {
            cy.get('input')
                .clear()
                .type(event.email || ' ')
        }
    },
    SUBMIT_FORM: (cy) => {
        cy.get('button').click()
    }
})


/* eslint-disable no-undef */
describe('form', function () {
    const testPlans = formModel.getSimplePathPlans()

    testPlans.forEach((plan) => {
        describe(plan.description, () => {
            plan.paths.forEach((path) => {
                it(path.description, () => {
                    cy.get('body').then(async () => {
                        await path.test(cy)
                    })
                })
            })
        })
    })
})

beforeEach(() => {
    cy.visit('')
})