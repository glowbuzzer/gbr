/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import {
    AnyAction,
    combineReducers,
    configureStore,
    Middleware,
    Reducer,
    StoreEnhancer
} from "@reduxjs/toolkit"
import {
    configSlice,
    framesSlice,
    GlowbuzzerConfig,
    prefsSlice,
    RootState,
    settings,
    standardReducers,
    telemetrySlice
} from "@glowbuzzer/store"

export const GlowbuzzerAppLifecycle = new (class {
    createStore(
        configuration: GlowbuzzerConfig,
        storeEnhancers: StoreEnhancer[],
        additionalReducers: Record<string, Reducer>
    ) {
        if (typeof import.meta !== "undefined" && import.meta?.hot?.data.store) {
            return import.meta.hot.data.store
        }

        const flowStorage = settings("flows")

        const localStorageMiddleware: Middleware<{}, RootState> =
            store => next => (action: AnyAction) => {
                const result = next(action)
                if (action.type.startsWith("flow/")) {
                    const state = store.getState()
                    flowStorage.save(state.flow.present)
                }
                return result
            }

        const middleware = (getDefault: (options: any) => Middleware[]) => {
            return getDefault({
                immutableCheck: false,
                serializableCheck: false
            }).concat(localStorageMiddleware)
        }

        const store = configureStore({
            reducer: combineReducers({ ...standardReducers, ...additionalReducers }),
            middleware,
            enhancers: storeEnhancers
        })

        store.dispatch(prefsSlice.actions.loadSettings(null))
        store.dispatch(framesSlice.actions.loadSettings(null))
        store.dispatch(configSlice.actions.loadOfflineConfig(configuration))
        store.dispatch(telemetrySlice.actions.loadSettings())

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
