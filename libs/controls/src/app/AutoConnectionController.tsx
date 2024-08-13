/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { useEffect } from "react"
import { ConnectionState, useConnection, usePrefs } from "@glowbuzzer/store"
import { useConnectionUrls } from "./hooks"

export const AutoConnectionController = ({ children = null, enabled }) => {
    const { state, connected, connect, autoConnect } = useConnection()
    const { gbcWebsocketUrl } = useConnectionUrls()

    useEffect(() => {
        if (enabled && autoConnect && !connected && state !== ConnectionState.CONNECTING) {
            console.log("Auto connecting using url", gbcWebsocketUrl)
            connect(gbcWebsocketUrl)
        }
    }, [enabled, connected /* some deps deliberately omitted */])

    return <>{children}</>
}
