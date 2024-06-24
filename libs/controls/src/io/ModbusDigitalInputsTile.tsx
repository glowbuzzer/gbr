/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import {
    useModbusDigitalInputList,
    useModbusDigitalInputState,
    useModbusUnsignedIntegerInputState
} from "@glowbuzzer/store"
import { StyledTileContent } from "../util/styles/StyledTileContent"
import { Tag, Tooltip } from "antd"

import styled from "styled-components"
import { ModbusErrorCodeString } from "./ModbusErrorCodeString"

type ModbusDigitalInputsTileProps = {
    /**
     * Override labels to use for inputs, in the order given in the configuration
     */
    labels?: string[]
}

const StyledDiv = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const ModbusDigitalInputItem = ({ label, description, index }) => {
    const dinStatus = useModbusDigitalInputState(index)
    // console.log("dinStatus", dinStatus)
    if (!dinStatus) {
        return (
            <StyledDiv key={index}>
                <Tooltip title={description}>
                    <div>{label}</div>
                </Tooltip>
                <div>
                    <Tag>No Data Available</Tag>
                </div>
            </StyledDiv>
        )
    }

    const { actValue, modbus_error_code, isError } = dinStatus

    return (
        <StyledDiv key={index}>
            <Tooltip title={description}>
                <div>{label}</div>
            </Tooltip>
            <div>
                <Tag color={actValue ? "green" : "red"}>{actValue ? "ON" : "OFF"}</Tag>
                {isError && (
                    <>
                        Error Code:{" "}
                        <Tag title={ModbusErrorCodeString(modbus_error_code)}>
                            {modbus_error_code}
                        </Tag>
                    </>
                )}
            </div>
        </StyledDiv>
    )
}

/**
 * The modbus digital inputs tile shows a simple view of all current digital input values.
 */
export const ModbusDigitalInputsTile = ({ labels = [] }: ModbusDigitalInputsTileProps) => {
    const dins = useModbusDigitalInputList()

    return (
        <StyledTileContent>
            {dins?.map((din, index) => {
                const description = `Slave: ${din.slave_num}, Address: ${din.address}, Function: ${
                    din.function
                }, Little Endian: ${din.little_endian ? "Yes" : "No"}, Inverted: ${
                    din.inverted ? "Yes" : "No"
                }`

                return (
                    <ModbusDigitalInputItem
                        key={index}
                        index={index}
                        label={labels[index] || din.name || `Input ${index}`}
                        description={description} // Passing description
                    />
                )
            })}
        </StyledTileContent>
    )
}
