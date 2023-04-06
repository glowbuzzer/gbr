/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React, { useEffect, useMemo, useRef, useState } from "react"
import {
    configSlice,
    ConnectionState,
    GlowbuzzerConnectionContext,
    GlowbuzzerConnectionContextType,
    RequestResponseHandler,
    useStatusProcessor
} from "@glowbuzzer/store"
import { useDispatch } from "react-redux"

export const ConnectionProvider = ({ children }) => {
    const [connection, setConnection] = useState<WebSocket>()
    const [autoConnect, setAutoConnect] = useState(false)
    const [state, setState] = useState(ConnectionState.DISCONNECTED)
    const [url, setUrl] = useState("")

    const process_status = useStatusProcessor(connection)
    const dispatch = useDispatch()
    const requestHandler = useRef<RequestResponseHandler>()

    useEffect(() => {
        if (connection) {
            const handler = new RequestResponseHandler(connection)
            requestHandler.current = handler
            handler.request("get config").then(response => {
                dispatch(configSlice.actions.setConfigFromRemote(response.config))
            })
            return () => handler.terminate()
        }
    }, [connection])

    function connect(url) {
        const connection = new WebSocket(url)
        setState(ConnectionState.CONNECTING)
        connection.onopen = () => {
            setConnection(connection)
            setState(ConnectionState.CONNECTED)
        }
        connection.onclose = () => {
            setConnection(undefined)
            setState(ConnectionState.DISCONNECTED)
        }
        connection.onmessage = event => {
            try {
                const msg = JSON.parse(event.data)
                process_status(msg)
                msg.response && requestHandler.current?.response(msg.response)
            } catch (e) {
                console.error(e)
            }
        }
    }

    const send = useMemo(() => {
        if (connection) {
            return connection.send.bind(connection)
        }
        return () => {
            console.error("Not connected!")
        }
    }, [connection])

    const context: GlowbuzzerConnectionContextType = useMemo(
        () => ({
            autoConnect,
            state,
            statusReceived: true,
            connected: !!connection,
            connect(url: string, autoConnect = true) {
                connect(url)
                setAutoConnect(autoConnect)
                setUrl(url)
            },
            reconnect() {
                connect(url)
            },
            send,
            request(type, body) {
                if (connection) {
                    return requestHandler.current?.request(type, body)
                }
            },
            disconnect() {
                connection?.close()
                setAutoConnect(false)
                setConnection(undefined)
            }
        }),
        [connection, state, autoConnect]
    )

    return (
        <GlowbuzzerConnectionContext.Provider value={context}>
            {children}
        </GlowbuzzerConnectionContext.Provider>
    )
}
