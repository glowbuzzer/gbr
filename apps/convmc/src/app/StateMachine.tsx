import { useEffect, useMemo, useRef } from "react"

export class StateMachine {
    current_state: string
    previous_state: string
    initial_state: string

    constructor(initial_state) {
        this.initial_state = initial_state
    }

    private transition(machine, to_state) {
        const next = machine[to_state]
        if (next === undefined) {
            throw new Error("Invalid next state: " + to_state)
        }
        this.previous_state = this.current_state
        this.current_state = to_state
        const result = next?.enter?.()
        // check if promise
        if (result && typeof result.then === "function") {
            result.then(r => {
                // only transition if state hasn't changed since entry
                r && this.current_state === to_state && this.transition(machine, r)
            })
        } else {
            result && this.transition(machine, result)
        }
    }

    eval(machine) {
        if (!this.current_state) {
            this.transition(machine, this.initial_state)
        }
        const state = machine[this.current_state]
        if (state === undefined) {
            throw new Error("Invalid current state: " + this.current_state)
        }
        if (state.transitions) {
            for (const [next_state, value] of Object.entries(state.transitions)) {
                if ((typeof value === "function" && value()) || value) {
                    state.exit?.()
                    this.transition(machine, next_state)
                    break // don't eval any more next state functions
                }
            }
        }
    }
}

export const useStateMachine = (definition, initial_state: string, dependencies) => {
    const machine = useRef(new StateMachine(initial_state))

    useEffect(() => {
        // every time the dependencies change we will evaluate the state machine
        machine.current.eval(definition)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...dependencies, definition])

    const { current_state, previous_state } = machine.current
    return useMemo(() => [current_state, previous_state], [current_state, previous_state])
}
