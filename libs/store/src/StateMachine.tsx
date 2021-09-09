import { useEffect, useMemo, useRef } from "react"

export class StateMachine {
    current_state: string
    previous_state: string
    initial_state: string
    user_data: string

    constructor(initial_state) {
        this.initial_state = initial_state
    }

    private transition(machine, to_state_ext) {
        // execute the exit function on current state if it exists
        const current = machine[this.current_state]
        current?.exit?.()

        // destructure to_state and user_data (depending on what is supplied)
        const { state: to_state, data } =
            typeof to_state_ext === "string" ? { state: to_state_ext, data: null } : to_state_ext

        const next = machine[to_state]
        if (next === undefined) {
            // console.log("INVALID TO STATE", to_state)
            throw new Error("Invalid next state: " + to_state)
        }

        // console.log("TRANSITION TO", to_state)

        this.previous_state = this.current_state
        this.current_state = to_state
        this.user_data = data

        const result = next?.enter?.()
        // check if promise
        if (result && typeof result.then === "function") {
            // console.log("AWAIT PROMISE OF STATE", to_state)
            result.then(r => {
                if (r) {
                    // only transition if state hasn't changed since entry
                    if (this.current_state === to_state) {
                        // console.log(
                        //     "TRANSITION AT END OF ENTER PROMISE, STATE=",
                        //     to_state,
                        //     "NEXT=",
                        //     r.state || r
                        // )
                        this.transition(machine, r)
                    } else {
                        // console.log(
                        //     "DID NOT TRANSITION TO",
                        //     r.state || r,
                        //     "IN STATE",
                        //     this.current_state,
                        //     "WAS STATE",
                        //     to_state
                        // )
                    }
                }
            })
        } else if (result) {
            // console.log("DIRECT TRANSITION FROM STATE", to_state, "TO", result.state || result)
            this.transition(machine, result)
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
        if (state?.transitions) {
            for (const [next_state, value] of Object.entries(state.transitions)) {
                if ((typeof value === "function" && value()) || value) {
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

    const { current_state, previous_state, user_data } = machine.current
    return useMemo(
        () => [current_state, previous_state, user_data],
        [current_state, previous_state, user_data]
    )
}
