/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Button, Flex, Space } from "antd"
import TextArea from "antd/es/input/TextArea"
import styled from "styled-components"
import { useConnection } from "@glowbuzzer/store"
import { useEffect, useState } from "react"

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
`

export const GbemConfigTab = () => {
    const { request } = useConnection()
    const [config, setConfig] = useState("")
    const [editedConfig, setEditedConfig] = useState("")
    const [rebooting, setRebooting] = useState(false)

    useEffect(() => {
        setEditedConfig(config)
    }, [config])

    function get_config() {
        request("get gbem config", {}).then(response => {
            setConfig(response.config)
        })
    }

    function upload_config() {
        return request("load gbem config", { config: JSON.parse(editedConfig) })
    }

    function reboot() {
        setRebooting(true)
        request("reboot gbem", { enable: true }).then(() => {
            setTimeout(() => {
                setRebooting(false)
                return request("reboot gbem", { enable: false })
            }, 2000)
        })
    }

    return (
        <StyledFlex>
            <Space>
                <Button size="small" onClick={get_config}>
                    Get GBEM Config
                </Button>
                <Button size="small" onClick={upload_config}>
                    Upload GBEM Config
                </Button>
                <Button size="small" onClick={reboot} loading={rebooting}>
                    Reboot GBEM
                </Button>
            </Space>
            <TextArea value={editedConfig} onChange={e => setEditedConfig(e.target.value)} />
        </StyledFlex>
    )
}
