/**
 * This file provides a Redux store enhancer and hook that allows override of digital inputs.
 * This is useful during development to similate digital inputs from GBC where there are none.
 */
import React, { useMemo, useState } from "react"
import { StoreEnhancer } from "@reduxjs/toolkit"
import { createContext, FC, useContext } from "react"

let values = []

type DigitalInputMockContextType = {
    set(index: number, override: boolean, value: boolean): void
    get(index): boolean
    isOverridden(index): boolean
}

const digitalInputMockContext = createContext<DigitalInputMockContextType>(null)

export const DigitalInputMockProvider: FC = ({ children }) => {
    const [state, setState] = useState([])
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

export function useDigitalInputOverrides() {
    const context = useContext(digitalInputMockContext)
    if (!context) {
        throw new Error("No digital input override context")
    }
    return context
}

export const digitalInputEnhancer: StoreEnhancer<any> = createStore => {
    return (rootReducer, preloadedState) => {
        const store = createStore<any>(rootReducer, preloadedState)
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
