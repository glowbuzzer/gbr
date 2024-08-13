/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { createSlice, Slice } from "@reduxjs/toolkit"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { settings } from "../util/settings"
import { useMemo } from "react"
import { RootState } from "../root"
import { ConversionFactors } from "./unit_conversion"

const { load, save } = settings<{ [index: string]: any }>("prefs")

type UnitsType = "m" | "mm" | "in" | "rad" | "deg" | "rev"

type PrefsState = {
    units_linear: "m" | "mm" | "in"
    units_angular: "rad" | "deg" | "rev"
    url: string
    precision: Record<UnitsType, number>
} & { [index: string]: any }

const default_precision: Record<UnitsType, number> = {
    m: 3,
    mm: 1,
    in: 2,
    rad: 3,
    deg: 1,
    rev: 3
}

export const prefsSlice: Slice<PrefsState> = createSlice({
    name: "prefs",
    initialState: {
        units_linear: "mm",
        units_angular: "rad",
        url: "ws://localhost:9001/ws",
        precision: default_precision
    },
    reducers: {
        loadSettings(store) {
            return { ...store, ...load() }
        },
        set(store, action) {
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
        units_linear: "mm" | "in"
        /** Default angular units */
        units_angular: "rad" | "deg"
        /** @deprecated Connection url for GBC websocket */
        url: string
        /** Hostname for GBC websocket and PouchDB */
        hostname: string
    } & {
        /** Application defined preferences */
        [index: string]: string | number | boolean
    }
    /** Store preference */
    update(name, value): void
    /** Convert value in preferred units to SI */
    toSI(value: number, type: "linear" | "angular"): number
    /** Convert value in SI to preferred units */
    fromSI(value: number, type: "linear" | "angular"): number
    /** Get current units of type */
    getUnits(type: "linear" | "angular"): { units: UnitsType; precision: number }
    setPrecision(type: UnitsType, precision: number): void
} {
    const prefs = useSelector(({ prefs }: RootState) => prefs, shallowEqual)
    const dispatch = useDispatch()
    return useMemo(
        () => ({
            current: prefs,
            toSI(value: number, type): number {
                return value * ConversionFactors[prefs["units_" + type]]
            },
            fromSI(value: number, type): number {
                return value / ConversionFactors[prefs["units_" + type]]
            },
            getUnits(type: "linear" | "angular"): { units: UnitsType; precision: number } {
                const units = prefs["units_" + type]
                const precision = prefs.precision[units]
                return { units, precision }
            },
            getPrecision(type: UnitsType): number {
                return prefs.precision[type]
            },
            setPrecision(type: UnitsType, precision: number) {
                dispatch(
                    prefsSlice.actions.set({
                        name: "precision",
                        value: { ...prefs.precision, [type]: precision }
                    })
                )
            },
            update(name, value) {
                if (name === "precision") {
                    throw new Error("Use setPrecision to update precision")
                }
                dispatch(prefsSlice.actions.set({ name, value }))
            }
        }),
        [dispatch, prefs]
    )
}

/**
 * Returns a function for converting between SI and preferred units, and a function to get the current linear and angular units.
 * @deprecated Use usePrefs instead
 */
export function useUnitConversion(): {
    /** Convert value in SI to preferred units */
    fromSI(value: number, type: "linear" | "angular"): number
    /** Get current units of the given type */
    getUnits(type: "linear" | "angular"): string
} {
    const prefs = useSelector(({ prefs }: RootState) => prefs, shallowEqual)
    const dispatch = useDispatch()
    return useMemo(
        () => ({
            fromSI(value: number, type): number {
                return value / ConversionFactors[prefs["units_" + type]]
            },
            getUnits(type: "linear" | "angular"): string {
                return prefs["units_" + type]
            }
        }),
        [dispatch, prefs]
    )
}

/**
 * Provides a hook for retrieving and updating a single preference.
 * @param name The name of the preference
 * @param defaultValue
 */
export function usePref<T = any>(name: string, defaultValue?: T): [T, (value: T) => void] {
    const prefs = useSelector(({ prefs }: RootState) => prefs, shallowEqual)
    const dispatch = useDispatch()
    return useMemo(() => {
        const currentValue = prefs[name]
        return [
            currentValue === undefined ? defaultValue : currentValue,
            value =>
                dispatch(
                    prefsSlice.actions.set({
                        name,
                        value
                    })
                )
        ]
    }, [dispatch, name, prefs])
}

export * from "./unit_conversion"
