/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { Button, Flex, Space, Row, Col, Card, Checkbox, Modal, message, Tag } from "antd"
import TextArea from "antd/es/input/TextArea"
import styled from "styled-components"
import { useConnection } from "@glowbuzzer/store"
import { useEffect, useState } from "react"
import { useEtherCatConfig } from "../EtherCatConfigContext"
import EtherCatConfigStatusIndicator from "../EtherCatConfigStatusIndicator"
import { ConditionalDisplayInOpEnabled } from "../../util/ConditionalDisplayInOpEnabled"

interface OptionalSlave {
    name: string
    isOptional: boolean
}

const slaveData: OptionalSlave[] = [
    { name: "SYNAPTICON_1", isOptional: false },
    { name: "SYNAPTICON_2", isOptional: false },
    { name: "SYNAPTICON_3", isOptional: false },
    { name: "SYNAPTICON_4", isOptional: false },
    { name: "SYNAPTICON_5", isOptional: false },
    { name: "SYNAPTICON_6", isOptional: false },
    { name: "EL1008", isOptional: true },
    { name: "EL2008", isOptional: false },
    { name: "EL6021", isOptional: true }
]

export const EtherCatOptionalSlavesTab = () => {
    const {
        config,
        setConfig,
        setEditedConfig,
        editedConfig,
        configLoaded,
        setConfigLoaded,
        configEdited,
        setConfigEdited
    } = useEtherCatConfig()

    const handleCheckboxChange = (slaveIndex: number, checked: boolean) => {
        if (editedConfig) {
            const updatedConfig = { ...editedConfig }
            updatedConfig.ethercat.slaves[slaveIndex].optional.is_enabled = checked
            setEditedConfig(updatedConfig)
            setConfigEdited(true)
        }
    }

    // Reset changes to original config
    const handleReset = () => {
        if (config) {
            setEditedConfig(config)
            setConfigEdited(false)
            message.info("Changes reset.")
        }
    }

    return (
        <ConditionalDisplayInOpEnabled>
            <EtherCatConfigStatusIndicator />
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
                <div style={{ textAlign: "left", fontSize: "14px" }}>
                    Select slaves to enable/disable in the EtherCAT configuration:
                </div>
                {editedConfig?.ethercat.slaves
                    .map((slave, originalIndex) => ({
                        ...slave,
                        originalIndex
                    })) // Attach the original index to each slave
                    .filter(slave => slave.optional.is_configurable) // Filter out non-configurable slaves
                    .map((slave, index) => (
                        <div key={index} style={{ marginBottom: "10px" }}>
                            <Checkbox
                                checked={slave.optional.is_enabled}
                                onChange={e =>
                                    handleCheckboxChange(slave.originalIndex, e.target.checked)
                                } // Use the original index
                            >
                                {slave.name}
                            </Checkbox>
                        </div>
                    ))}
                <Space>
                    <Button onClick={handleReset}>Reset</Button>
                </Space>
            </Space>
        </ConditionalDisplayInOpEnabled>
    )
}
