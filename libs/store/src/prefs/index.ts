import { createSlice, Slice } from "@reduxjs/toolkit"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { settings } from "../util/settings"
import { useMemo } from "react"
import { RootState } from "../root"

const default_prefs = {
    units_scalar: "mm",
    units_angular: "rad",
    url: "ws://localhost:9001/ws"
}

type PrefsState = {
    units_scalar: "mm" | "in"
    units_angular: "rad" | "deg"
    url: string
} & { [index: string]: string }

const { load, save } = settings("glowbuzzer.prefs")

function getPrefsAsObject(): PrefsState {
    return {
        ...default_prefs,
        ...load()
    }
}

export const prefsSlice: Slice<PrefsState> = createSlice({
    name: "prefs",
    initialState: getPrefsAsObject(),
    reducers: {
        set: (store, action) => {
            const { name, value } = action.payload
            store[name] = value
            save(store)
        }
    }
})

/**
 * Returns current preferences and a method for updating preferences.
 *
 * There are only a small number of GBR supported preferences, but this hook can be used
 * to retrieve and update additional preferences as required by your application. Preferences
 * are stored in browser local storage.
 */
export function usePrefs(): {
    current: {
        /** Default scalar units */
        units_scalar: "mm" | "in"
        /** Default angular units */
        units_angular: "rad" | "deg"
        /** Connection url for GBC websocket */
        url: string
    } & {
        /** Application defined preferences */
        [index: string]: string
    }
    update(name, value): void
} {
    const prefs = useSelector(({ prefs }: RootState) => prefs, shallowEqual)
    const dispatch = useDispatch()
    return useMemo(
        () => ({
            current: prefs,
            update(name, value) {
                dispatch(prefsSlice.actions.set({ name, value }))
            }
        }),
        [dispatch, prefs]
    )
}
