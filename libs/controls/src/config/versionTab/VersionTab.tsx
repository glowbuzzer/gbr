import React from "react"
import { useState, useEffect, useRef } from "react"
import { GBEM_REQUEST, useConnection, useGbcConfigInfo } from "@glowbuzzer/store"
import { Alert, Button, Popover, Space, Tag } from "antd"
import { check_gbc_version } from "../../status/StatusTrayGbcVersionCheck"

export const VersionTab = () => {
    const { connected } = useConnection()
    const { gbcVersion, schemaVersion } = useGbcConfigInfo()
    const { request } = useConnection()
    const requestType = GBEM_REQUEST.GBEM_REQUEST_GET_VERSION
    const [isError, setIsError] = useState(false)

    const [requestText, setRequestText] = useState('{"payload": {}}')
    const [responseText, setResponseText] = useState("No request sent")

    const send_request = () => {
        request(requestType, JSON.parse(requestText))
            .then(response => {
                console.log("Response", response)
                setIsError(false)

                // Extract dev_ver from the response
                if (response?.payload?.value) {
                    setResponseText(response.payload.value)
                } else {
                    setResponseText("Unexpected response format")
                }

                console.log("Formatted Response", response)
            })
            .catch(err => {
                console.error("Error", err)
                setIsError(true)
                setResponseText(`Error in fetching version: ${JSON.stringify(err, null, 2)}`)
            })
    }

    if (!(gbcVersion && schemaVersion && connected)) {
        return (
            <Alert
                message="Not in machine state Operation Enabled"
                description="You can only read the software versions when connected to the machine."
                type="warning"
                showIcon
            />
        )
    }

    const { message } = check_gbc_version(gbcVersion, schemaVersion)
    return (
        <>
            <Popover content={message}>
                <span className="version-info">
                    Core control (GBC) version:
                    <Tag>GBC {gbcVersion}</Tag>
                </span>
            </Popover>

            <div>
                <Button type="primary" onClick={send_request}>
                    Send Request for gbem version
                </Button>
            </div>
            <div style={{ marginTop: "16px" }}>
                EtherCAT controller (GBEM) version:{" "}
                <Tag color={isError ? "red" : "purple"}>{responseText}</Tag>
            </div>
        </>
    )
}
