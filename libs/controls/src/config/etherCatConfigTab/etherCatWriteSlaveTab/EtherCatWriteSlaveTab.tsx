import styled from "styled-components"
import * as React from "react"
import { useState, useEffect, useRef } from "react"

import { GBEM_REQUEST, useConnection } from "@glowbuzzer/store"
import { Alert, Button, Input } from "antd"
import { ConditionalDisplayInOpEnabled } from "../../util/ConditionalDisplayInOpEnabled"

export const EtherCatWriteSlaveTab: React.FC = ({}) => {
    const { request } = useConnection()
    const requestType = GBEM_REQUEST.GBEM_REQUEST_SDO_WRITE
    const [requestText, setRequestText] = useState(
        '{"payload": {"index": 0x1000, "subindex": 0, "length": 2}}'
    )
    const [responseText, setResponseText] = useState("")
    const [isError, setIsError] = useState(false)

    function send_request() {
        request(requestType, JSON.parse(requestText))
            .then(response => {
                console.log("Response", response)
                // if (response?.response?.error) {
                //     setIsError(true)
                //     setResponseText(response.response.message)
                // } else {
                setIsError(false)

                // }

                // console.log("Response", response)
                // setResponseText(JSON.stringify(response, null, 2))
            })
            .catch(err => {
                console.error("Error", err)
                setIsError(true)
                setResponseText(err)
            })
    }

    useEffect(() => {
        const constructedRequestText = JSON.stringify({
            payload: {
                slave: 2, // Add the slave idx here
                index: 0x1000,
                subindex: 0,
                datatype: 4,
                length: 2,
                value: 42
            }
        })
        setRequestText(constructedRequestText)
    }, [])
    return (
        <ConditionalDisplayInOpEnabled>
            <Input.TextArea
                rows={4}
                value={requestText}
                onChange={e => setRequestText(e.target.value)}
            />
            <Button type="primary" onClick={send_request}>
                Send Request
            </Button>
            {isError && <Alert message="Error" description={responseText} type="error" showIcon />}
            {!isError && responseText && (
                <Alert
                    message="Response"
                    description={<pre>{responseText}</pre>}
                    type="success"
                    showIcon
                />
            )}
        </ConditionalDisplayInOpEnabled>
    )
}
