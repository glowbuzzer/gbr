/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { Framework } from "./framework"
import { configureStore } from "@reduxjs/toolkit"
import {
    ConnectionState,
    digitalInputsSlice,
    digitalOutputsSlice,
    GlowbuzzerConnectionContext,
    GlowbuzzerConnectionContextType,
    GlowbuzzerStatus,
    MessageResponse,
    rootReducer,
    useConnection,
    useDigitalOutputState,
    useStatusProcessor
} from "@glowbuzzer/store"
import WebSocket from "ws"
import { useEffect, useRef } from "react"
import { log } from "./framework/log"

try {
    log("run")

    const store = configureStore({
        reducer: rootReducer
    })

    const f = Framework.create(store)

    const ws = new WebSocket("ws://10.10.0.2:9001/ws")

    f.addContext<GlowbuzzerConnectionContextType>(GlowbuzzerConnectionContext, {
        state: ConnectionState.CONNECTED,
        statusReceived: true,
        disconnect(): void {},
        reconnect(): void {},
        request(type, body): Promise<MessageResponse> {
            return Promise.resolve(undefined)
        },
        connected: true,
        send(msg) {
            // log("sending message", msg)
            ws.send(msg)
        },
        autoConnect: true,
        connect(url: string, autoConnect?: boolean) {}
    })

    ws.on("open", () => {
        function connection_handler() {
            log("initializing connection handler")
            useStatusProcessor(ws)
        }

        f.register(connection_handler)

        f.register(() => {
            const { connected } = useConnection()
            const [output, setter] = useDigitalOutputState(0)
            const value = useRef(false)

            useEffect(() => {
                if (connected) {
                    const timer = setInterval(() => {
                        value.current = !value.current
                        setter(value.current, true)
                    }, 1000)
                    return () => {
                        clearTimeout(timer)
                    }
                }
            }, [connected])

            useEffect(() => {
                log("output changed:", output.effectiveValue)
            }, [output.effectiveValue])
        })
    })
    ws.on("message", m => {
        const msg: GlowbuzzerStatus = JSON.parse(m.toString())

        if (msg.status) {
            const heartbeat = msg.status.machine.heartbeat
            // msg.status.machine && dispatch(machineSlice.actions.status(msg.status.machine))
            // msg.status.tasks && dispatch(tasksSlice.actions.status(msg.status.tasks))
            // msg.status.activity && dispatch(activitySlice.actions.status(msg.status.activity))
            // msg.status.joint && dispatch(jointsSlice.actions.status(msg.status.joint))
            if (msg.status.din) {
                store.dispatch(
                    digitalInputsSlice.actions.status({ status: msg.status.din, heartbeat })
                )
            }
            if (msg.status.dout) {
                store.dispatch(
                    digitalOutputsSlice.actions.status({ status: msg.status.dout, heartbeat })
                )
            }
        }
    })
    ws.on("error", err => {
        console.log("error", err.message)
    })
} catch (e) {
    console.log("error", e)
}
