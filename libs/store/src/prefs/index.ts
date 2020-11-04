import { createSlice } from "@reduxjs/toolkit"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { RootState } from "@glowbuzzer/store"

const default_prefs = {
    units_scalar: "mm",
    units_angular: "rad",
    url: "ws://localhost:9001/ws"
}

type PrefsState = typeof default_prefs & { [index: string]: string }

function getPrefsAsObject(): PrefsState {
    const prefs = localStorage.getItem("glowbuzzer.prefs")
    // const prefs = prefsString; // localStorage.getItem("glowbuzzer.prefs");
    try {
        const prefsObj = JSON.parse(prefs)
        return {
            ...default_prefs,
            ...prefsObj
        }
    } catch (e) {
        console.warn("Invalid prefs:", e.message)
        return default_prefs
    }
}

export const prefsSlice = createSlice({
    name: "prefs",
    initialState: getPrefsAsObject(),
    reducers: {
        set: (store, action) => {
            const { name, value } = action.payload
            store[name] = value
            localStorage.setItem("glowbuzzer.prefs", JSON.stringify(store))
        }
    }
})

export const usePrefs = () => {
    const prefs = useSelector(({ prefs }: RootState) => prefs, shallowEqual)
    const dispatch = useDispatch()
    return {
        current: prefs,
        set(name, value) {
            dispatch(prefsSlice.actions.set({ name, value }))
        }
    }
}
