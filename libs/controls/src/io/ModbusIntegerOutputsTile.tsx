/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { useState } from "react"
import {
    useModbusIntegerOutputList,
    useModbusIntegerOutputNumberofList,
    useSoloActivity
} from "@glowbuzzer/store"
import styled from "styled-components"
import { StyledTileContent } from "../util/styles/StyledTileContent"
import { Button, Card, Col, InputNumber, Row, Space, Spin, Tooltip, Typography } from "antd"

const { Text } = Typography

const StyledCard = styled(Card)`
    .ant-card-body {
        padding: 10px;
    }
`

const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`

const TitleContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
`

const TitleContent = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`

interface ModbusIntegerOutputItemProps {
    index: number
    label: string | number
    numberOf: number
    description?: string
    start_address?: number
    end_address?: number
}

const ModbusIntegerOutputItem: React.FC<ModbusIntegerOutputItemProps> = ({
    index,
    label,
    numberOf,
    description,
    start_address,
    end_address
}) => {
    const api = useSoloActivity(0)
    // const [modbusIntegerOutputState, setModbusIntegerOutputState] = useState(0) // Initial state is 0
    const [loading, setLoading] = useState(false)
    const [modbusIntegerOutputStates, setModbusIntegerOutputStates] = useState<number[]>(
        Array(numberOf).fill(false)
    )

    const handleValueChange = (value: number, arrayIndex: number) => {
        const newStates = [...modbusIntegerOutputStates]
        newStates[arrayIndex] = value
        setModbusIntegerOutputStates(newStates)

        if (numberOf === 1) {
            setLoading(true)
            api.setModbusUiout(index, newStates)
                .promise()
                .then(() => {
                    console.log(
                        `Modbus integer output ${index} at position ${arrayIndex} set to ${value}.`
                    )
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }
    const handleWrite = () => {
        setLoading(true)
        api.setModbusUiout(index, modbusIntegerOutputStates)
            .promise()
            .then(() => {
                console.log(`Modbus integer outputs ${index} set to ${modbusIntegerOutputStates}.`)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const renderCardTitle = () => (
        <TitleContainer>
            <TitleContent>
                <Tooltip title={description}>
                    <Text>
                        <p style={{ fontWeight: "bold" }}>{label}</p>
                        <p style={{ fontStyle: "italic" }}>
                            (Address{" "}
                            {start_address === end_address
                                ? `${start_address} (0x${start_address
                                      .toString(16)
                                      .padStart(4, "0")})`
                                : `from ${start_address} (0x${start_address
                                      .toString(16)
                                      .padStart(4, "0")}) to ${end_address} (0x${end_address
                                      .toString(16)
                                      .padStart(4, "0")})`}
                            )
                        </p>
                    </Text>
                </Tooltip>
            </TitleContent>
            {numberOf > 1 && (
                <Button type="primary" onClick={handleWrite} loading={loading} size="small">
                    Set all
                </Button>
            )}
        </TitleContainer>
    )

    return (
        <StyledCard title={renderCardTitle()} size="small" bordered>
            <Row gutter={16} align="middle">
                <Col span={16}>
                    <Space direction="vertical">
                        {Array.from({ length: numberOf }).map((_, i) => (
                            <Space key={i}>
                                <Text>
                                    {" "}
                                    {start_address + i} (
                                    {`0x${(start_address + i).toString(16).padStart(4, "0")}`})
                                </Text>
                                <Spin spinning={loading && numberOf === 1}>
                                    <InputNumber
                                        value={modbusIntegerOutputStates[i]}
                                        onChange={value => handleValueChange(value, i)}
                                        disabled={loading && numberOf === 1}
                                        min={0}
                                        max={65535}
                                        step={1}
                                        style={{
                                            height: "22px",
                                            width: "50px",
                                            fontSize: "10px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    />
                                </Spin>
                            </Space>
                        ))}
                    </Space>
                </Col>
            </Row>
        </StyledCard>
    )
}

type IntegerOutputsTileProps = {
    /**
     * Override labels to use for outputs, in the order given in the configuration
     */
    labels?: string[]
}

/**
 * The modbus integer outputs tile allows you to view and control all modbus integer outputs on a machine.
 *
 */
export const ModbusIntegerOutputsTile = ({ labels = [] }: IntegerOutputsTileProps) => {
    const uiouts = useModbusIntegerOutputList()
    const uioutNumberof = useModbusIntegerOutputNumberofList()

    return (
        <StyledTileContent>
            <StyledContainer>
                {uiouts?.map((config, index) => (
                    <ModbusIntegerOutputItem
                        key={index}
                        index={index}
                        label={labels[index] || config.name || index.toString()}
                        numberOf={uioutNumberof[index]}
                        description={config.description || "No description"}
                        start_address={config.startAddress}
                        end_address={config.endAddress}
                    />
                ))}
            </StyledContainer>
        </StyledTileContent>
    )
}
