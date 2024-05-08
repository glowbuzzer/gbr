/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import styled from "styled-components"
import { Button, Flex, Space } from "antd"
import TextArea from "antd/es/input/TextArea"
import * as React from "react"
import { GBEM_REQUEST, useConnection } from "@glowbuzzer/store"
import { useState } from "react"

const StyledFlex = styled(Flex)`
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: space-between;

    .ant-input {
        flex-grow: 1;
        font-family: monospace;
    }

    .response {
        font-family: monospace;
        white-space: pre;
        overflow: auto;
        flex-grow: 0.2;
        background: ${props => props.theme.colorBgElevated};
        border-radius: 10px;
        padding: 10px;
    }
`

export const GbemRequestTab = () => {
    const { request } = useConnection()
    const requestType = GBEM_REQUEST.GBEM_REQUEST_SDO_READ
    const [requestText, setRequestText] = useState('{"payload": {"index": 0x1000, "subindex": 0}}')
    const [responseText, setResponseText] = useState("")

    function send_request() {
        request(requestType, JSON.parse(requestText))
            .then(response => {
                console.log("Response", response)
                setResponseText(JSON.stringify(response, null, 2))
            })
            .catch(err => {
                console.error("Error", err)
            })
    }

    return (
        <StyledFlex>
            <Space>
                <Button size="small" onClick={send_request}>
                    Send Request
                </Button>
            </Space>
            <TextArea value={requestText} onChange={e => setRequestText(e.target.value)} />
            <div className="response">{responseText}</div>
        </StyledFlex>
    )
}
