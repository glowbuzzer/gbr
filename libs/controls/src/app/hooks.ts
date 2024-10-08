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

    const protocol = window.location.protocol === "https:" ? "wss" : "ws"
    const auto_host=window.location.hostname
    const github_codespaces=auto_host.endsWith("app.github.dev")

    const host = prefs.current.hostname?.length ? prefs.current.hostname : staticHost || auto_host
    return {
        readonly: prod && staticHost,
        host,
        staticHost,
        gbcWebsocketUrl: github_codespaces ? `wss://${host.replace("5173", "9001")}/ws` : `${protocol}://${host}:9001/ws`,
        pouchDbBase: remotePouchDb ? `http://${host}:5984/` : ""
    }
}
