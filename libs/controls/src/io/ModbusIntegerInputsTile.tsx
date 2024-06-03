/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { Tag } from "antd"
import styled from "styled-components"
import {
    useModbusUnsignedIntegerInputList,
    useModbusUnsignedIntegerInputState
} from "@glowbuzzer/store"
import { StyledTileContent } from "../util/styles/StyledTileContent"
import { ModbusErrorCodeString } from "./ModbusErrorCodeString"

const StyledDiv = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const ModbusIntegerInputItem = ({ label, index }) => {
    const ainStatus = useModbusUnsignedIntegerInputState(index)
    if (!ainStatus) {
        return (
            <StyledDiv key={index}>
                <div>{label}</div>
                <div>
                    <Tag>No Data Available</Tag>
                </div>
            </StyledDiv>
        )
    }

    const { actValue, modbus_error_code, isError } = ainStatus

    return (
        <StyledDiv key={index}>
            <div>{label}</div>
            <div>
                Value: <Tag>{actValue}</Tag>
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
 * The digital inputs tile shows a simple table of all current digital input values.
 *
 * The labels property allows you to provide meaningful labels to each input.
 */
export const ModbusIntegerInputsTile = ({ labels = [] }: ModbusIntegerInputsTileProps) => {
    const iin = useModbusUnsignedIntegerInputList()

    return (
        <StyledTileContent>
            {iin?.map(({ name }, index) => (
                <ModbusIntegerInputItem
                    key={index}
                    index={index}
                    label={labels[index] || name || index}
                />
            ))}
        </StyledTileContent>
    )
}
