import { useEffect, useRef, useState } from "react"

/**
 * Defines a simple state machine consisting of states, transitions and callbacks when entering and existing states.
 *
 * See also {@link useStateMachine}.
 */
export type StateMachineDefinition = {
    /** The set of states keyed by state name */
    [index: string]: {
        /** Called when entering a state. Can optionally return a new state to transition to (by name, or name plus user-defined payload). */
        enter?():
            | void
            | string
            | { state: string; data: unknown }
            | Promise<void | string | { state: string; data: unknown }>

        /**
         * Called when exiting a state
         */
        exit?(): void

        /** Possible transitions out of this state. The keys of the object are the target
         * state names. The values are either a boolean, or a function returning boolean.
         * A transition is triggered when its value evaluates as true.
         */
        transitions?: { [index: string]: (() => boolean) | boolean }
    }
}

export class StateMachine {
    public currentState: string | undefined
    public userData: string | undefined
    private readonly initialState: string
    private previousState: string | undefined
    private readonly onChangeHandler: (state: {
        currentState: string
        previousState?: string
        userData: unknown
    }) => void

    /**
     * Construct a new state machine.
     *
     * @param initialState The state to enter when the state machine is first instantiated
     * @param onChange Function that will be called when state changes. Used to trigger re-render by the {@link useStateMachine} hook.
     */
    constructor(
        initialState: string,
        onChange?: (state: {
            currentState: string
            previousState?: string
            userData: unknown
        }) => void
    ) {
        this.initialState = initialState
        this.onChangeHandler = onChange
    }

    /**
     * Perform an eval on the given state machine.
     *
     * Checks the transitions of the currently active state and performs the tr
     * @param machine
     */
    eval(machine: StateMachineDefinition) {
        if (!this.currentState) {
            // first eval
            this.transition(machine, this.initialState)
        }
        const state = machine[this.currentState]
        if (state === undefined) {
            throw new Error("Invalid current state: " + this.currentState)
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

    private triggerChangeEffect() {
        const { currentState, previousState, userData } = this
        this.onChangeHandler?.({ currentState, previousState, userData })
    }

    private transition(machine: StateMachineDefinition, to_state_ext) {
        // execute the exit function on current state if it exists
        const current = machine[this.currentState]
        current?.exit?.()

        // destructure to_state and user_data (depending on what is supplied)
        const { state: to_state, data } =
            typeof to_state_ext === "string" ? { state: to_state_ext, data: null } : to_state_ext

        const next = machine[to_state]
        if (next === undefined) {
            throw new Error("Invalid next state: " + to_state)
        }

        this.previousState = this.currentState
        this.currentState = to_state
        this.userData = data
        // trigger state change in hook to cause re-render
        this.triggerChangeEffect()

        const result = next?.enter?.()
        // check if promise
        if (result && typeof result["then"] === "function") {
            result["then"](r => {
                if (r) {
                    // only transition if state hasn't changed since entry
                    if (this.currentState === to_state) {
                        this.transition(machine, r)
                    }
                }
            })
        } else if (result) {
            this.transition(machine, result)
        }
    }
}

/**
 * Evaluates the state machine given and returns current state, previous state and any user defined data associated with the latest transition.
 *
 * The state machine definition can contain dynamic values that change (for example due to React state changes). The re-evaluation
 * of the state machine (that is, any state transitions) will occur when values in the dependency array changes. You can think of the
 * return from this function being the memoised state of the state machine based on the provided dependencies.
 *
 * See {@link StateMachineDefinition} for the structure of the state machine definition and refer to the [GBR state machine](/docs/gbr/state_machine) section
 * of the GBR documentation for a full worked example.
 *
 * @param definition The state machine definition
 * @param initialState The initial state to enter on creation
 * @param dependencies The values that can trigger state changes
 */
export const useStateMachine = (
    definition: StateMachineDefinition,
    initialState: string,
    dependencies
): { currentState: string; previousState?: string; userData: unknown } => {
    const [stateMachineState, setStateMachineState] = useState<{
        currentState: string
        previousState?: string
        userData: unknown
    }>({
        currentState: initialState,
        previousState: undefined,
        userData: undefined
    })
    const machine = useRef(new StateMachine(initialState, setStateMachineState))

    useEffect(() => {
        // every time the dependencies change, including the definition itself, we will evaluate the state machine
        machine.current.eval(definition)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...dependencies, definition])

    return stateMachineState
}
