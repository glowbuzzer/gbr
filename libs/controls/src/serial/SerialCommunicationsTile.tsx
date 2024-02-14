/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import styled from "styled-components"
import { Button, Input, Space, Tag, Timeline } from "antd"
import { useState } from "react"
import {
    useSerialCommunication,
    useSerialCommunicationReceive,
    useSerialCommunicationReadyState
} from "@glowbuzzer/store"

const StyledDiv = styled.div`
    padding: 10px;

    .input {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
    }

    .ant-timeline {
        margin-top: 20px;

        .ant-timeline-item {
            padding-bottom: 3px;

            .ant-timeline-item-content {
                font-family: monospace;
            }
        }
    }
`

type Message = {
    position: "left" | "right"
    value: number[]
}

export const SerialCommunicationsTile = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [hex, setHex] = useState<string>("")
    const ready = useSerialCommunicationReadyState()
    const { sendData } = useSerialCommunication()

    const can_send = ready && !!hex.length

    useSerialCommunicationReceive(data => {
        setMessages(current => [
            ...current,
            {
                position: "left",
                value: data
            }
        ])
    })

    function send_message() {
        // remove all whitespace from hex string and convert to array of numbers by splitting every 2 characters
        const hex_array = hex
            .replace(/\s/g, "")
            .match(/.{1,2}/g)
            .map(x => parseInt(x, 16))

        setMessages(current => [
            ...current,
            {
                position: "right",
                value: hex_array
            }
        ])

        sendData(hex_array)
        setHex("")
    }

    function update_hex(e: React.ChangeEvent<HTMLInputElement>) {
        setHex(e.target.value)
    }

    return (
        <StyledDiv>
            <div className="input">
                <Input
                    size="small"
                    type="text"
                    placeholder="Enter hex to send"
                    value={hex}
                    onChange={update_hex}
                />
                <Button size="small" onClick={send_message} disabled={!can_send}>
                    Send
                </Button>
                <Button size="small" onClick={() => setMessages([])} disabled={!messages.length}>
                    Clear
                </Button>
                {ready || <Tag color="red">Not initialised</Tag>}
            </div>
            <Timeline
                mode="alternate"
                items={messages.map((m, index) => ({
                    key: index,
                    position: m.position,
                    children: m.value
                        .map(c => c.toString(16).padStart(2, "0").toUpperCase())
                        .join(" ")
                }))}
            />
        </StyledDiv>
    )
}
