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

type PrefsState = typeof default_prefs & { [index: string]: string }

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

export const usePrefs = () => {
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
