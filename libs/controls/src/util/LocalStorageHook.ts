import { useCallback, useMemo, useState } from "react"

export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>((): T => {
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key)
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue
        } catch (error) {
            // If error also return initialValue
            console.log(error)
            return initialValue
        }
    })

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = useMemo(() => {
        return (value: T | ((val: T) => T)) => {
            try {
                setStoredValue(current => {
                    const valueToStore = value instanceof Function ? value(current) : value
                    window.localStorage.setItem(key, JSON.stringify(valueToStore))
                    return valueToStore
                })
            } catch (error) {
                // A more advanced implementation would handle the error case
                console.log(error)
            }
        }
    }, [key])

    return [storedValue, setValue]
}
