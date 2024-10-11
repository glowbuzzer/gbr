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
    retryCount: number
}

const DISCONNECTED_STATE: ConnectionProviderPrivateState = {
    connection: null,
    connectionState: ConnectionState.DISCONNECTED,
    autoConnect: false,
    retryCount: 0
}

export const ConnectionProvider = ({ autoConnect: defaultAutoConnect, children }) => {
    const dispatch = useDispatch()
    const handler = useRequestHandler()

    const [state, setState] = useState<ConnectionProviderPrivateState>({
        ...DISCONNECTED_STATE,
        autoConnect: defaultAutoConnect,
        retryCount: 0
    })

    const { connectionState, connection, autoConnect, retryCount } = state
    const [lastStatus, setLastStatus] = useState<GlowbuzzerStatus["status"]>(null)

    const process_status = useStatusProcessor(connection)

    const autoConnectRef = useRef(false)
    const appReloadRef = useRef(false)
    const urlRef = useRef("")

    function init_connection(websocket: WebSocket) {
        websocket.onmessage = msg => {
            const message: GlowbuzzerStatus = JSON.parse(msg.data)
            // TODO: H: this is only used to pass current status to external flowmaker endpoint
            //          it causes a problem because it always changes, and so causes a lot of re-renders,
            //          and seems to cause max nested state change errors in React
            // if (message.status) {
            //     setLastStatus(message.status)
            // }
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
                autoConnect: true,
                retryCount: 0
            })
            init_connection(websocket)
        }
    }, [])

    useEffect(() => {
        if (retryCount) {
            const timer = setTimeout(() => {
                connect(urlRef.current)
            }, 1000)

            return () => clearTimeout(timer)
        }
    }, [retryCount])

    function connect(url: string, autoConnect = true) {
        urlRef.current = url

        const connection = GlowbuzzerAppLifecycle.connect(url)

        autoConnectRef.current = autoConnect
        setState({
            connection: null,
            connectionState: ConnectionState.CONNECTING,
            autoConnect,
            retryCount: retryCount
        })

        connection.onopen = () => {
            init_connection(connection)
            setState({
                connection,
                connectionState: ConnectionState.CONNECTED,
                autoConnect: autoConnectRef.current,
                retryCount: 0
            })
        }

        function handle_close() {
            console.log(
                "Connection closed",
                "reconnect enabled=",
                autoConnectRef.current,
                "retry count=",
                retryCount
            )
            handler.clear()
            setState({
                ...DISCONNECTED_STATE,
                autoConnect: autoConnectRef.current,
                retryCount: autoConnectRef.current ? retryCount + 1 : 0
            })
        }

        connection.onclose = handle_close
    }

    function send(msg: string) {
        if (!connection || connection.readyState !== WebSocket.OPEN) {
            // console.warn("No connection open for send")
            return
        }
        connection.send(msg)
    }

    function request(type: any, body) {
        return handler.request(state.connection, type, body)
    }

    const context: GlowbuzzerConnectionContextType = useMemo(
        () => ({
            autoConnect,
            retryCount,
            state: connectionState,
            statusReceived: true,
            lastStatus,
            connected: connectionState === ConnectionState.CONNECTED,
            connect,
            reconnect() {
                console.log("Reconnect called, url =", urlRef.current)
                connect(urlRef.current)
            },
            send,
            request,
            disconnect() {
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
