/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { createContext, useContext } from "react"
import { usePrefs } from "@glowbuzzer/store"
import { ConnectionConfiguration } from "./types"

export const appNameContext = createContext<string>("unknown")
export const connectionConfigurationContext = createContext<ConnectionConfiguration>({})

export function useAppName() {
    return React.useContext(appNameContext)
}

export function useConnectionUrls() {
    const prefs = usePrefs()
    const { hostname: staticHost, remotePouchDb } = useContext(connectionConfigurationContext)

    const prod = import.meta.env.MODE === "production"

    if (prod && !staticHost) {
        console.warn(
            "No remote hostname provided in production mode. You should add connectionConfiguration to the GlowbuzzerApp component"
        )
    }

    const host = prefs.current.hostname?.length ? prefs.current.hostname : staticHost || "localhost"
    return {
        readonly: prod && staticHost,
        host,
        staticHost,
        gbcWebsocketUrl: `ws://${host}:9001/ws`,
        pouchDbBase: remotePouchDb ? `http://${host}:5984/` : ""
    }
}
