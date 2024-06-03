/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { useState } from "react"
import {
    useModbusIntegerOutputList,
    useIntegerOutputState,
    useSoloActivity,
    useMachine,
    MachineState,
    useModbusIntegerOutputNumberofList
} from "@glowbuzzer/store"
import { NumericOutputWidget } from "./NumericOutputWidget"
import styled from "styled-components"
import { StyledTileContent } from "../util/styles/StyledTileContent"
import { Alert, Button, Col, InputNumber, Row, Spin } from "antd"

const StyledDiv = styled.div`
    > div {
        display: flex;
        gap: 10px;
        //align-items: center;
        flex-wrap: wrap;
    }

    .output-label {
        flex-grow: 1;
    }
`

interface ModbusIntegerOutputItemProps {
    index: number
    label: string | number
    numberOf: number
    span: number
    totalColumns: number
}

const ModbusIntegerOutputItem: React.FC<ModbusIntegerOutputItemProps> = ({
    index,
    label,
    numberOf,
    span,
    totalColumns
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

    return (
        <Row
            gutter={5}
            align="middle"
            wrap={false}
            style={{ display: "flex", flexWrap: "nowrap", marginBottom: "2px", marginLeft: "5px" }}
        >
            <Col span={span}>
                <label className="output-label">{label}</label>
            </Col>
            {Array.from({ length: numberOf }).map((_, i) => (
                <Col key={i} span={span}>
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
                </Col>
            ))}
            {numberOf < totalColumns - 2 && (
                <Col span={span}>
                    <span />
                </Col>
            )}
            {numberOf > 1 && (
                <Col span={span}>
                    <Button
                        type="primary"
                        onClick={() => handleWrite()}
                        loading={loading}
                        style={{
                            height: "22px",
                            fontSize: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        Write
                    </Button>
                </Col>
            )}
        </Row>
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

    // Calculate the maximum number of columns
    const maxNumberOf = Math.max(...uioutNumberof)
    const totalColumns = maxNumberOf + 2 // Adding 2 for label and button
    const span = Math.floor(24 / totalColumns) // Ensure span is an integer

    console.log("maxNumberOf", maxNumberOf)
    console.log("totalColums", totalColumns)
    console.log("span", span)

    const machineState = useMachine().currentState
    // if (machineState !== MachineState.OPERATION_ENABLED) {
    //     return (
    //         <StyledTileContent>
    //             <Alert
    //                 message="Not in machine state Operation Enabled"
    //                 description="You can only set Modbus Integer Outputs in Operation Enabled."
    //                 type="warning"
    //                 showIcon
    //             />
    //         </StyledTileContent>
    //     )
    // }

    return (
        <StyledTileContent>
            <StyledDiv>
                {uiouts?.map(({ name }, index) => (
                    <ModbusIntegerOutputItem
                        key={index}
                        index={index}
                        label={labels[index] || name || index}
                        numberOf={uioutNumberof[index]}
                        span={span}
                        totalColumns={totalColumns}
                    />
                ))}
            </StyledDiv>
        </StyledTileContent>
    )
}
