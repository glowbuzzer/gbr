/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { combineReducers, configureStore, Reducer, StoreEnhancer, Tuple } from "@reduxjs/toolkit"
import {
    configSlice,
    framesSlice,
    GbdbConfiguration,
    gbdbHigherOrderReducerFactory,
    gbdbMiddleware,
    GlowbuzzerConfig,
    prefsSlice,
    standardReducers,
    telemetrySlice
} from "@glowbuzzer/store"

export const GlowbuzzerAppLifecycle = new (class {
    createStore(
        configuration: GlowbuzzerConfig,
        storeEnhancers: StoreEnhancer[],
        additionalReducers: Record<string, Reducer>,
        persistenceConfiguration: GbdbConfiguration = { facets: {} }
    ) {
        if (typeof import.meta !== "undefined" && import.meta?.hot?.data.store) {
            // console.log("GlowbuzzerAppLifecycle: reusing existing store (hot reload)")
            return import.meta.hot.data.store
        }

        const reducer = gbdbHigherOrderReducerFactory(
            persistenceConfiguration.facets,
            combineReducers({ ...standardReducers, ...additionalReducers })
        )

        const store = configureStore({
            reducer,
            middleware: getDefaultMiddleware =>
                getDefaultMiddleware({
                    immutableCheck: false,
                    serializableCheck: false
                }).concat(gbdbMiddleware(persistenceConfiguration.facets)),
            enhancers: () => new Tuple(...storeEnhancers)
        })

        store.dispatch(prefsSlice.actions.loadSettings(null))
        store.dispatch(framesSlice.actions.loadSettings(null))
        store.dispatch(telemetrySlice.actions.loadSettings())

        if (configuration) {
            if (!configuration.machine?.[0]?.name) {
                throw new Error("Local app configuration must specify a machine name")
            }
            store.dispatch(configSlice.actions.setAppConfig(configuration))
        }

        if (import.meta?.hot?.data) {
            import.meta.hot.data.store = store
        }

        return store
    }

    connect(url: string): WebSocket {
        if (import.meta?.hot) {
            const { url: existingUrl, websocket } = import.meta.hot.data as {
                url: string
                websocket: WebSocket
            }

            if (websocket?.readyState === WebSocket.OPEN && url === existingUrl) {
                // re-use existing
                return websocket
            }

            // console.log("CONNECT", new Error().stack)
            import.meta.hot.data.url = url
            import.meta.hot.data.websocket = new WebSocket(url)

            return import.meta.hot.data.websocket
        }
        return new WebSocket(url)
    }

    get websocket(): WebSocket {
        if (import.meta?.hot) {
            return import.meta.hot.data.websocket
        }
        return null
    }
})()
