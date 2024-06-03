/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { useState } from "react"
import { Alert, Button, Col, Row, Select, Switch, Tag } from "antd"
import styled from "styled-components"
import {
    MachineState,
    useMachine,
    useModbusDigitalOutputList,
    useModbusDigitalOutputNumberofList,
    useSoloActivity
} from "@glowbuzzer/store"
import { StyledTileContent } from "../util/styles/StyledTileContent"

const { Option } = Select

const SwitchContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex-wrap: wrap;
`

const StyledDiv = styled.div`
    //padding-top: 20px;

    > div {
        display: flex;
        gap: 10px;
        align-items: center;
    }

    .dout-label {
        flex-grow: 1;
    }

    .ant-tag {
        width: 40px;
        text-align: center;
    }
`

type DigitalOutputsTileProps = {
    /**
     * Override labels to use for outputs, in the order given in the configuration
     */
    labels?: string[]
}

/**
 * The modbus digital outputs tile allows you to view and control all modbus igital outputs on a machine.
 *
 */
export const ModbusDigitalOutputsTile = ({ labels = [] }: DigitalOutputsTileProps) => {
    const douts = useModbusDigitalOutputList()
    const doutNumberof = useModbusDigitalOutputNumberofList()

    const machineState = useMachine().currentState
    // if (machineState !== MachineState.OPERATION_ENABLED) {
    //     return (
    //         <StyledTileContent>
    //             <Alert
    //                 message="Not in machine state Operation Enabled"
    //                 description="You can only set Modbus Digital Outputs in Operation Enabled."
    //                 type="warning"
    //                 showIcon
    //             />
    //         </StyledTileContent>
    //     )
    // }
    return (
        <StyledTileContent>
            <StyledDiv>
                {douts?.map((config, index) => (
                    <ModbusDigitalOutputItem
                        key={index}
                        index={index}
                        label={labels[index] || config.name || index.toString()}
                        numberOf={doutNumberof[index]}
                    />
                ))}
            </StyledDiv>
        </StyledTileContent>
    )
}

interface ModbusDigitalOutputItemProps {
    index: number
    label: string | number
    numberOf: number
}

const ModbusDigitalOutputItem: React.FC<ModbusDigitalOutputItemProps> = ({
    index,
    label,
    numberOf
}) => {
    const api = useSoloActivity(0)

    const [loading, setLoading] = useState(false)
    const [modbusDigitalOutputStates, setModbusDigitalOutputStates] = useState<boolean[]>(
        Array(numberOf).fill(false)
    )

    const handleToggle = (switchIndex: number, checked: boolean, numberOf: number) => {
        const newStates = [...modbusDigitalOutputStates]
        newStates[switchIndex] = checked
        setModbusDigitalOutputStates(newStates)

        if (numberOf === 1) {
            setLoading(true)
            api.setModbusDout(index, newStates)
                .promise()
                .then(() => {
                    console.log(`Modbus digital output ${index} set to ${checked ? "ON" : "OFF"}.`)
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }

    const handleWrite = () => {
        setLoading(true)

        api.setModbusDout(index, modbusDigitalOutputStates)
            .promise()
            .then(() => {
                console.log(`Modbus digital outputs ${index} set to ${modbusDigitalOutputStates}.`)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    // useEffect(() => {
    //     // Initial state setup or any other side effects
    // }, []);

    return (
        <Row gutter={10} style={{ marginBottom: "2px" }}>
            <Col span={4}>
                <label className="dout-label">{label}</label>
            </Col>
            {Array.from({ length: numberOf }).map((_, i) => (
                <Col key={i} span={4}>
                    <Switch
                        checked={modbusDigitalOutputStates[i]}
                        onChange={checked => handleToggle(i, checked, numberOf)}
                        checkedChildren="ON"
                        unCheckedChildren="OFF"
                        loading={loading && numberOf === 1}
                    />
                </Col>
            ))}
            {numberOf > 1 && (
                <Col span={4}>
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
