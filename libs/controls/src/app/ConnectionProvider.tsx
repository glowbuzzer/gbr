/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React, { useEffect, useMemo, useRef, useState } from "react"
import {
    configSlice,
    ConnectionState,
    GlowbuzzerConnectionContext,
    GlowbuzzerConnectionContextType,
    GlowbuzzerStatus,
    RequestResponseHandler,
    useStatusProcessor
} from "@glowbuzzer/store"
import { useDispatch } from "react-redux"

type ConnectionProviderStaticState = {
    count: number
    websocket: WebSocket
    url: string
    handler: RequestResponseHandler
}

const store: ConnectionProviderStaticState = {
    count: 0,
    websocket: null,
    url: null,
    handler: null
}

type ConnectionProviderPrivateState = {
    connection: WebSocket
    connectionState: ConnectionState
    autoConnect: boolean
}

const DISCONNECTED_STATE: ConnectionProviderPrivateState = {
    connection: null,
    connectionState: ConnectionState.DISCONNECTED,
    autoConnect: false
}

export const ConnectionProvider = ({ children }) => {
    const [state, setState] = useState<ConnectionProviderPrivateState>(DISCONNECTED_STATE)
    const dispatch = useDispatch()

    const { connectionState, connection, autoConnect } = state
    const process_status = useStatusProcessor(connection)

    const autoConnectRef = useRef(false)

    function init_connection() {
        console.log("✅ connection open", store.count, "reconnect enabled=", autoConnectRef.current)

        store.websocket.onmessage = msg => {
            const status: GlowbuzzerStatus = JSON.parse(msg.data)
            status.response && store.handler.response(status.response)
            process_status(status)
        }

        store.websocket.onclose = () => {
            console.log(
                "❌ connection closed",
                store.count,
                "reconnect enabled=",
                autoConnectRef.current
            )
            store.handler.rejectAll()
            store.websocket.close()
            setState({ ...DISCONNECTED_STATE, autoConnect: autoConnectRef.current })
        }

        // dispatch(traceSlice.actions.reset(0)) // clear tool path on connect
        // dispatch(framesSlice.actions.setActiveFrame(0)) // set active frame (equivalent to G54)
        // dispatch(telemetrySlice.actions.init()) // reset telemetry
        // dispatch(machineSlice.actions.init()) // reset machine state

        store.handler.request("get config").then(response => {
            dispatch(configSlice.actions.setConfigFromRemote(response.config))
        })
    }

    useEffect(() => {
        // this effect is called on initial mount
        // if the component has been hot reloaded, the existing 'store' holding any previous websocket
        // will be intact, but the rest of the application state will have been discarded, so we need
        // to re-initialize
        if (store.websocket?.readyState === WebSocket.OPEN && store.url === store.websocket.url) {
            // we're already connected, just do initial connection logic
            autoConnectRef.current = true
            setState({
                connection: store.websocket,
                connectionState: ConnectionState.CONNECTED,
                autoConnect: true
            })
            init_connection()
        }
    }, [])

    function connect(url, autoConnect = true) {
        store.url = url
        store.count++
        store.websocket = new WebSocket(store.url)
        store.handler = new RequestResponseHandler(store.websocket)

        autoConnectRef.current = autoConnect
        setState({
            connection: null,
            connectionState: ConnectionState.CONNECTING,
            autoConnect
        })

        store.websocket.onopen = () => {
            init_connection()
            setState({
                connection: store.websocket,
                connectionState: ConnectionState.CONNECTED,
                autoConnect: autoConnectRef.current
            })
        }

        store.websocket.onerror = () => {
            setState({
                connection: null,
                connectionState: ConnectionState.DISCONNECTED,
                autoConnect: autoConnectRef.current
            })
        }
    }

    function send(msg) {
        if (!connection || connection.readyState !== WebSocket.OPEN) {
            console.error("No connection open for send")
            return
        }
        connection.send(msg)
    }

    function request(type, body) {
        if (!store.handler) {
            throw new Error("No request handler for request")
        }
        return store.handler.request(type, body)
    }

    const context: GlowbuzzerConnectionContextType = useMemo(
        () => ({
            autoConnect,
            state: connectionState,
            statusReceived: true,
            connected: connectionState === ConnectionState.CONNECTED,
            connect,
            reconnect() {
                console.log("Reconnect called with auto connect=", autoConnectRef.current)
                connect(store.url)
            },
            send,
            request,
            disconnect() {
                console.log("Disconnect called")
                setState(DISCONNECTED_STATE)
                autoConnectRef.current = false
                store.websocket?.close()
            }
        }),
        [connection, connectionState, autoConnect]
    )

    return (
        <GlowbuzzerConnectionContext.Provider value={context}>
            {children}
        </GlowbuzzerConnectionContext.Provider>
    )
}
