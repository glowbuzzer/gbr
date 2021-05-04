const windowGlobal = typeof window !== "undefined" && window
const localStorage = windowGlobal?.localStorage

export function settings(key: string) {
    return {
        load(defaultValue = {}) {
            try {
                const valueString = localStorage.getItem(key)
                if (valueString) {
                    return JSON.parse(valueString) || defaultValue
                }
            } catch (_e) {
                return defaultValue
            }
            return defaultValue
        },
        save(value) {
            if (localStorage) {
                localStorage.setItem(key, JSON.stringify(value))
            }
            return value
        }
    }
}
