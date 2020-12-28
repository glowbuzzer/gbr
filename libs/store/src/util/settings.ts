export function settings(key: string) {
    return {
        load() {
            const valueString = localStorage.getItem(key)
            if (valueString) {
                try {
                    return JSON.parse(valueString) || {}
                } catch (_e) {
                    return {}
                }
            }
            return {}
        },
        save(value) {
            console.log("STORE IN LS, key=", key, "value=", value)
            localStorage.setItem(key, JSON.stringify(value))
        }
    }
}
