/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

const windowGlobal = typeof window !== "undefined" && window
const localStorage = windowGlobal ? windowGlobal.localStorage : null

let globalAppName: string

export function initSettings(appName: string) {
    globalAppName = appName
}

export function settings(key: string) {
    return {
        load(defaultValue = {}) {
            if (!globalAppName) {
                console.warn("initSettings has not been called to set app name")
            }

            const appKey = `${globalAppName}-${key}`

            try {
                if (localStorage) {
                    const valueString = localStorage.getItem(appKey)
                    if (valueString) {
                        return JSON.parse(valueString) || defaultValue
                    }
                }
            } catch (_e) {
                return defaultValue
            }
            return defaultValue
        },
        save(value) {
            if (!globalAppName) {
                console.warn("initSettings has not been called to set app name")
            }

            const appKey = `${globalAppName}-${key}`

            if (localStorage) {
                localStorage.setItem(appKey, JSON.stringify(value))
            }
            return value
        }
    }
}
