/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { useEffect } from "react"
import { ConnectionState, useConnection, usePrefs } from "@glowbuzzer/store"

export const AutoConnectionController = ({ children = null, enabled }) => {
    const { state, connected, connect } = useConnection()
    const prefs = usePrefs()

    useEffect(() => {
        if (enabled && !connected && state !== ConnectionState.CONNECTING) {
            connect(prefs.current.url)
        }
    }, [enabled, connected /*, state, prefs.current.url*/])

    return children
}
