/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import {Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState} from "react"
import {useAppName} from "@glowbuzzer/controls";

function parseJSON<T>(value: string | null): T | undefined {
    try {
        return value === "undefined" ? undefined : JSON.parse(value ?? "")
    } catch {
        console.log("parsing error on", {value})
        return undefined
    }
}

type SetValue<T> = Dispatch<SetStateAction<T>>

export function useLocalStorage<T>(
    key: string,
    initialValue: T,
    overrideAppName?: string
): [T, SetValue<T>] {
    const appName = overrideAppName ?? useAppName()
    const appkey = appName ? `${appName}-${key}` : key

    // Get from local storage then
    // parse stored json or return initialValue
    const readValue = useCallback((): T => {
        // Prevent build error "window is undefined" but keep keep working
        if (typeof window === "undefined") {
            return initialValue
        }

        try {
            const item = window.localStorage.getItem(appkey)
            return item ? (parseJSON(item) as T) : initialValue
        } catch (error) {
            console.warn(`Error reading localStorage key “${appkey}”:`, error)
            return initialValue
        }
    }, [initialValue, appkey])

    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(readValue)

    const setValueRef = useRef<SetValue<T>>()

    setValueRef.current = value => {
        // Prevent build error "window is undefined" but keeps working
        if (typeof window == "undefined") {
            console.warn(
                `Tried setting localStorage key “${appkey}” even though environment is not a client`
            )
        }

        try {
            // Allow value to be a function so we have the same API as useState
            const newValue = value instanceof Function ? value(storedValue) : value

            // Save to local storage
            window.localStorage.setItem(appkey, JSON.stringify(newValue))

            // Save state
            setStoredValue(newValue)

            // We dispatch a custom event so every useLocalStorage hook are notified
            window.dispatchEvent(new Event("local-storage"))
        } catch (error) {
            console.warn(`Error setting localStorage key “${appkey}”:`, error)
        }
    }

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue: SetValue<T> = useCallback(value => setValueRef.current?.(value), [])

    useEffect(() => {
        setStoredValue(readValue())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [readValue])

    const currentValue = useMemo(readValue, [storedValue, appkey])

    return [currentValue, setValue]
}
