/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { Reducer, StoreEnhancer } from "@reduxjs/toolkit"
import {
    ConnectionState,
    GbdbConfiguration,
    GlowbuzzerConnectionContext,
    GlowbuzzerConnectionContextType,
    initSettings,
    MessageResponse
} from "@glowbuzzer/store"
import * as React from "react"
import { ReactNode } from "react"
import { GlowbuzzerAppLifecycle } from "./lifecycle"
import { appNameContext } from "./hooks"
import { GlowbuzzerThemeProvider } from "./GlowbuzzerThemeProvider"
import { Provider } from "react-redux"
import { GbdbProvider } from "../gbdb"

type GlowbuzzerStandaloneAppProps = {
    /** The unique name for the application, used to prefix local storage keys */
    appName: string
    /** Enhancers that can be used to manipulate the store. See [the Redux Toolkit documentation](https://redux-toolkit.js.org/api/configureStore#enhancers) */
    storeEnhancers?: StoreEnhancer[]
    /** Additional reducers to add to the store. You can use this to add slices to the Redux store. */
    additionalReducers?: { [index: string]: Reducer }
    /** Configuration for slice persistence */
    persistenceConfiguration?: GbdbConfiguration
    /** Your application */
    children: ReactNode
}

export const GlowbuzzerStandaloneApp = ({
    appName,
    persistenceConfiguration,
    storeEnhancers,
    additionalReducers,
    children
}: GlowbuzzerStandaloneAppProps) => {
    initSettings(appName)

    const store = GlowbuzzerAppLifecycle.createStore(
        {
            machine: [{ name: "default" }]
        },
        storeEnhancers,
        additionalReducers,
        persistenceConfiguration
    )

    const connectionContext: GlowbuzzerConnectionContextType = {
        state: ConnectionState.DISCONNECTED,
        connected: false,
        autoConnect: false,
        statusReceived: false,
        lastStatus: null,
        retryCount: 0,
        connect(url: string, autoConnect?: boolean) {
            throw new Error("Not implemented")
        },
        disconnect() {
            throw new Error("Not implemented")
        },
        send() {
            throw new Error("Not implemented")
        },
        request(): Promise<MessageResponse> {
            throw new Error("Not implemented")
        },
        reconnect() {
            throw new Error("Not implemented")
        }
    }

    return (
        <GlowbuzzerConnectionContext.Provider value={connectionContext}>
            <appNameContext.Provider value={appName}>
                <GlowbuzzerThemeProvider>
                    <Provider store={store}>
                        <GbdbProvider configuration={persistenceConfiguration}>
                            {children}
                        </GbdbProvider>
                    </Provider>
                </GlowbuzzerThemeProvider>
            </appNameContext.Provider>
        </GlowbuzzerConnectionContext.Provider>
    )
}
