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

const SlaveGrid: React.FC = () => {
    return (
        <Row gutter={[1, 1]} style={{ margin: 0 }}>
            {slaveData.map((slave, index) => (
                <Col key={index} xs={2} sm={2} md={2} lg={2}>
                    <Card bordered={true}>
                        <div
                            style={{
                                height: 150,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                whiteSpace: "nowrap"
                            }}
                        >
                            <div style={{ transform: "rotate(-90deg)", marginBottom: 16 }}>
                                {slave.name}
                            </div>
                            {slave.isOptional && (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        marginLeft: 0,
                                        alignItems: "center",
                                        transform: "rotate(-90deg)"
                                    }}
                                >
                                    <Checkbox checked={slave.isOptional} disabled />
                                </div>
                            )}
                        </div>
                    </Card>
                </Col>
            ))}
        </Row>
    )
}

const SlaveGrid2: React.FC = () => {
    return (
        <Space>
            <Row gutter={[1, 1]} style={{ margin: 0 }}>
                {slaveData.map((slave, index) => (
                    <Col key={index} xs={2} sm={2} md={2} lg={2}>
                        {/* Card for the Name */}
                        <Card bordered={true} style={{ marginBottom: 0, textAlign: "center" }}>
                            <div
                                style={{
                                    alignItems: "center", // Vertically center in the flex container
                                    justifyContent: "center", // Horizontally center in the flex container
                                    height: "100%", // Take full height of the container
                                    display: "flex",
                                    transform: "rotate(-90deg)",
                                    transformOrigin: "center",
                                    whiteSpace: "nowrap",
                                    textOverflow: "hidden",
                                    maxWidth: "200px"
                                }}
                            >
                                {slave.name}
                            </div>
                        </Card>
                        {/* Card for the Checkbox, only if isOptional is true */}
                        <Card bordered={true} style={{ textAlign: "center", height: "50%" }}>
                            {slave.isOptional ? (
                                <Checkbox checked={slave.isOptional} disabled></Checkbox>
                            ) : (
                                <div style={{ height: "20px" }}></div> // Placeholder for an empty card
                            )}
                        </Card>
                    </Col>
                ))}
            </Row>
        </Space>
    )
}

interface Slave {
    name: string
    isOptional: boolean
}

const slaveData: Slave[] = [
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
        <>
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
        </>
    )
}
