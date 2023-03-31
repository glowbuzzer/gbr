/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React, { useRef, useState } from "react"
import { Button } from "antd"

export const ConnTest = () => {
    const [connections, setConnections] = useState([])
    const countRef = useRef(1)

    function open_connection() {
        const socket = new WebSocket("ws://10.10.0.2:9002/ws")

        const id = countRef.current++
        const entry = { id, socket, title: "Connection " + id }
        setConnections(current => [...current, entry])

        function update(change) {
            return current =>
                current.map(c =>
                    c.id === id
                        ? {
                              ...c,
                              ...change
                          }
                        : c
                )
        }

        socket.onopen = function () {
            setConnections(update({ open: true }))
        }
        socket.onclose = function () {
            setConnections(update({ closed: true, open: false }))
        }
        socket.onerror = function (e) {
            this.close()
            setConnections(update({ error: true, open: false }))
        }
    }

    function close_connection(index: number) {
        const { socket } = connections[index]
        socket.close()
    }

    return (
        <>
            <Button onClick={open_connection}>OPEN</Button>
            {connections.map(({ socket, title, open, closed, error }, index) => (
                <Button key={index} onClick={() => close_connection(index)}>
                    {title} {open && "OPEN"} {closed && "CLOSED"} {error && "ERROR"}
                </Button>
            ))}
        </>
    )
}
