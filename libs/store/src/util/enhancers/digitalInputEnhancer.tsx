/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

/**
 * This file provides a Redux store enhancer and hook that allows override of digital inputs.
 * This is useful during development to similate digital inputs from GBC where there are none.
 * An alternative is to configure a digital output as a loopback to a digital input, which is
 * more appropriate if you need GBC to react to the input (for example, by triggering the start
 * of a move).
 */
import React, { createContext, useContext, useMemo, useState } from "react"
import { Store, StoreEnhancer } from "@reduxjs/toolkit"

let values = []

type DigitalInputMockContextType = {
    set(index: number, override: boolean, value: boolean): void
    get(index): boolean
    isOverridden(index): boolean
}

const digitalInputMockContext = createContext<DigitalInputMockContextType | null>(null)

export const DigitalInputMockProvider = ({ children }) => {
    const [state, setState] = useState([] as boolean[])
    const context = useMemo(
        () => ({
            set(index: number, override: boolean, value: boolean) {
                setState(current => {
                    const next = [...current]
                    next[index] = override ? value : undefined
                    values = next
                    return next
                })
            },
            get(index) {
                return state[index]
            },
            isOverridden(index) {
                return state[index] !== undefined
            }
        }),
        [state]
    )
    return (
        <digitalInputMockContext.Provider value={context}>
            {children}
        </digitalInputMockContext.Provider>
    )
}

/**
 * @ignore
 */
export function useDigitalInputOverrides() {
    const context = useContext(digitalInputMockContext)
    if (!context) {
        throw new Error("No digital input override context")
    }
    return context
}

export const digitalInputEnhancer: StoreEnhancer<any> = createStore => {
    return (rootReducer, preloadedState) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const store: Store<any> = createStore(rootReducer, preloadedState)
        return {
            ...store,
            getState() {
                const state = store.getState()
                state.din = state.din.map((v, index) =>
                    values[index] === undefined ? v : values[index]
                )
                return state
            }
        }
    }
}
