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
import { Tag } from "antd"

import styled from "styled-components"
import { ModbusErrorCodeString } from "./ModbusErrorCodeString"

const StyledDigitalInput = styled.div`
    display: flex;
    padding: 1px 0;

    .label {
        flex-grow: 1;
    }

    .ant-tag {
        width: 40px;
        text-align: center;
    }
`

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

const ModbusDigitalInputItem = ({ label, index }) => {
    const dinStatus = useModbusDigitalInputState(index)
    // console.log("dinStatus", dinStatus)
    if (!dinStatus) {
        return (
            <StyledDiv key={index}>
                <div>{label}</div>
                <div>
                    <Tag>No Data Available</Tag>
                </div>
            </StyledDiv>
        )
    }

    const { actValue, modbus_error_code, isError } = dinStatus

    return (
        <StyledDiv key={index}>
            <div>{label}</div>
            <div>
                Value: <Tag color={actValue ? "green" : "red"}>{actValue ? "ON" : "OFF"}</Tag>
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

type ModbusIntegerInputsTileProps = {
    /**
     * Override labels to use for inputs, in the order given in the configuration
     */
    labels?: string[]
}

/**
 * The modbus digital inputs tile shows a simple view of all current digital input values.
 */
export const ModbusDigitalInputsTile = ({ labels = [] }: ModbusDigitalInputsTileProps) => {
    const dins = useModbusDigitalInputList()

    // console.log("dins", dins)

    return (
        <StyledTileContent>
            {dins?.map(({ name }, index) => (
                <ModbusDigitalInputItem
                    key={index}
                    index={index}
                    label={labels[index] || name || index}
                />
            ))}
        </StyledTileContent>
    )
}
