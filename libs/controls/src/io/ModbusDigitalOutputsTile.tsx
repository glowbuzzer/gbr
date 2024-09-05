/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { useState } from "react"
import {
    Alert,
    Button,
    Card,
    Col,
    Row,
    Select,
    Space,
    Switch,
    Tag,
    Tooltip,
    Typography
} from "antd"
import styled from "styled-components"
import {
    MachineState,
    useMachine,
    useModbusDigitalOutputList,
    useModbusDigitalOutputNumberofList,
    useSoloActivity
} from "@glowbuzzer/store"
import { StyledTileContent } from "../util/styles/StyledTileContent"
import { ControlOutlined } from "@ant-design/icons"

const { Option } = Select

const { Text } = Typography

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

const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
`

const StyledCard = styled(Card)`
    .ant-card-body {
        padding: 10px;
    }
`

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

    //todo i can't possibly forget this again?
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
            <StyledContainer>
                {douts?.map((config, index) => (
                    <ModbusDigitalOutputItem
                        key={index}
                        index={index}
                        label={labels[index] || config.name || index.toString()}
                        numberOf={doutNumberof[index]}
                        description={config.description || "No description"}
                        start_address={config.startAddress}
                        end_address={config.endAddress}
                    />
                ))}
            </StyledContainer>
        </StyledTileContent>
    )
}

interface ModbusDigitalOutputItemProps {
    index: number
    label: string | number
    numberOf: number
    description?: string
    start_address?: number
    end_address?: number
}

const ModbusDigitalOutputItem: React.FC<ModbusDigitalOutputItemProps> = ({
    index,
    label,
    numberOf,
    description,
    start_address,
    end_address
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
                                <Switch
                                    checked={modbusDigitalOutputStates[i]}
                                    onChange={checked => handleToggle(i, checked, numberOf)}
                                    checkedChildren="ON"
                                    unCheckedChildren="OFF"
                                    size="small"
                                    loading={loading && numberOf === 1}
                                />
                            </Space>
                        ))}
                    </Space>
                </Col>
            </Row>
        </StyledCard>
    )
}
