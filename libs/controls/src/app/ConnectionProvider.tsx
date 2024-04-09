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
    useRequestHandler,
    useStatusProcessor
} from "@glowbuzzer/store"
import { useDispatch } from "react-redux"
import { GlowbuzzerAppLifecycle } from "./lifecycle"

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
    const dispatch = useDispatch()
    const handler = useRequestHandler()

    const [url, setUrl] = useState()
    const [state, setState] = useState<ConnectionProviderPrivateState>(DISCONNECTED_STATE)
    const { connectionState, connection, autoConnect } = state
    const [lastStatus, setLastStatus] = useState<GlowbuzzerStatus["status"]>(null)

    const process_status = useStatusProcessor(connection)

    const autoConnectRef = useRef(false)
    const appReloadRef = useRef(false)

    function init_connection(websocket: WebSocket) {
        console.log("✅ connection open", "reconnect enabled=", autoConnectRef.current)

        websocket.onmessage = msg => {
            const message: GlowbuzzerStatus = JSON.parse(msg.data)
            if (message.status) {
                setLastStatus(message.status)
            }
            if (message.response) {
                handler.response(message.response)
            } else {
                process_status(message)
            }
        }

        handler.request(websocket, "get config").then(response => {
            // console.log("Setting config from remote")
            dispatch(configSlice.actions.setRemoteConfig(response.config))
        })
    }

    useEffect(() => {
        // this effect is called on initial mount
        // if the component has been hot reloaded, the previous websocket held by GlowbuzzerAppLifecycle
        // should be intact, but the rest of the application state will have been discarded, so we need
        // to re-initialize
        const websocket = GlowbuzzerAppLifecycle.websocket

        if (websocket?.readyState === WebSocket.OPEN && !appReloadRef.current) {
            // we're already connected, just do initial connection logic
            appReloadRef.current = true // to prevent repeat calls to this effect
            autoConnectRef.current = true
            setState({
                connection: websocket,
                connectionState: ConnectionState.CONNECTED,
                autoConnect: true
            })
            init_connection(websocket)
        }
    }, [])

    function connect(url, autoConnect = true) {
        setUrl(url)

        const connection = GlowbuzzerAppLifecycle.connect(url)

        autoConnectRef.current = autoConnect
        setState({
            connection: null,
            connectionState: ConnectionState.CONNECTING,
            autoConnect
        })

        connection.onopen = () => {
            init_connection(connection)
            setState({
                connection,
                connectionState: ConnectionState.CONNECTED,
                autoConnect: autoConnectRef.current
            })
        }

        connection.onclose = () => {
            console.log("❌ connection closed", "reconnect enabled=", autoConnectRef.current)
            handler.clear()
            setState({ ...DISCONNECTED_STATE, autoConnect: autoConnectRef.current })
        }

        connection.onerror = () => {
            setState({
                connection: null,
                connectionState: ConnectionState.DISCONNECTED,
                autoConnect: autoConnectRef.current
            })
        }
    }

    function send(msg) {
        if (!connection || connection.readyState !== WebSocket.OPEN) {
            console.warn("No connection open for send")
            return
        }
        connection.send(msg)
    }

    function request(type, body) {
        return handler.request(state.connection, type, body)
    }

    const context: GlowbuzzerConnectionContextType = useMemo(
        () => ({
            autoConnect,
            state: connectionState,
            statusReceived: true,
            lastStatus,
            connected: connectionState === ConnectionState.CONNECTED,
            connect,
            reconnect() {
                // console.log("Reconnect called with auto connect=", autoConnectRef.current)
                connect(url)
            },
            send,
            request,
            disconnect() {
                // console.log("Disconnect called")
                setState(DISCONNECTED_STATE)
                autoConnectRef.current = false
                state.connection?.close()
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
