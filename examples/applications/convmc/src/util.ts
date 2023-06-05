/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { StateMachineDefinition } from "@glowbuzzer/store"
import { useRef } from "react"

/**
 * Simple memoization hook for a state machine definition. The state machine might change current state, but the
 * states and relationships typically don't change between renders. This hook allows you to memoize based just on
 * the states themselves.
 */
export function useArrayMemo<T>(
    fn: (definition: StateMachineDefinition) => T,
    definition: StateMachineDefinition
) {
    const value = useRef<T>()
    const keys = useRef<string[]>()

    function equal(a: any[], b: any[]) {
        return a.length === b.length && a.every((value, index) => value === b[index])
    }

    const new_keys = Object.keys(definition) // we assume these don't change order

    if (!keys.current || !equal(new_keys, keys.current)) {
        keys.current = new_keys
        value.current = fn(definition)
    }
    return value.current
}
