import React from "react"
import { useState, useEffect, useRef } from "react"
import { GBEM_REQUEST, useConnection, useGbcConfigInfo } from "@glowbuzzer/store"
import { Alert, Button, Card, Flex, Popover, Space, Tag } from "antd"
import { check_gbc_version } from "../../status/StatusTrayGbcVersionCheck"
import { DockTileDisabledWithNestedSupport } from "../../dock"

/**
 * A component to display the software versions of the different software components.
 */

export const VersionTab = () => {
    const { connected } = useConnection()
    const { gbcVersion, schemaVersion } = useGbcConfigInfo()
    const { request } = useConnection()
    const requestType = GBEM_REQUEST.GBEM_REQUEST_GET_VERSION
    const [isError, setIsError] = useState(false)

    const [requestText, setRequestText] = useState('{"payload": {}}')
    const [responseText, setResponseText] = useState("No version read")

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

    const { message } = check_gbc_version(gbcVersion, schemaVersion)
    return (
        <DockTileDisabledWithNestedSupport disabled={!connected}>
            <Flex style={{ padding: "10px" }} vertical gap="small">
                <Card title={"Core control (GBC) software version"} size="small">
                    <Popover content={message}>
                        <span className="version-info">
                            <Tag>GBC {gbcVersion}</Tag>
                        </span>
                    </Popover>
                </Card>

                <Card title={"Schema version"} size="small">
                    <Tag>GBC {schemaVersion}</Tag>
                </Card>

                <Card title={"EtherCAT controller (GBEM) software version"} size="small">
                    <Button type="primary" onClick={send_request} size="small">
                        Read version from EtherCAT controller
                    </Button>
                    <Tag style={{ marginLeft: "10px" }} color={isError ? "red" : "purple"}>
                        {responseText}
                    </Tag>
                </Card>
            </Flex>
        </DockTileDisabledWithNestedSupport>
    )
}
