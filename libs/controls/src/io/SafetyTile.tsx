/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { useState } from "react"
import {
    useDigitalInputList,
    useDigitalInputs,
    useDigitalOutputState,
    useSafetyDigitalInputList,
    useSafetyDigitalInputs,
    useSafetyDigitalInputState,
    useSafetyDigitalOutputList,
    useSafetyDigitalOutputState
} from "@glowbuzzer/store"
import { StyledSafetyTileContent } from "../util/styles/StyledTileContent"
import { Tag, Select, Switch, Button, Space } from "antd"
import styled from "styled-components"

const { Option } = Select

const StyledResetButton = styled.div`
    margin-top: 8px; /* Adjust the margin value as needed */
`

const StyledSafetyInput = styled.div`
    display: flex;
    //padding: 1px 0;

    .label {
        flex-grow: 1;
    }

    .ant-tag {
        //width: 40px;
        text-align: center;
    }
`

type SafetyInputsTileProps = {
    /**
     * Override labels to use for inputs, in the order given in the configuration
     */
    labels?: string[]
}

/**
 * The safety tile
 */
export const SafetyTile = ({ labels = [] }: SafetyInputsTileProps) => {
    //Saftey Dout 0 is used acknowledge the restart
    const [dout, setDout] = useSafetyDigitalOutputState(1)

    const safetyDins = useSafetyDigitalInputList()
    const safetyValues = useSafetyDigitalInputs()
    const [isRestartAck, setIsRestartAck] = useState(false)

    // safety Din 2 is used to signal that a restart acknowledge is needed
    const resetAckNeeded = useSafetyDigitalInputState(2)

    const handleResetClick = () => {
        // Check if a reset is not already in progress
        if (!isRestartAck) {
            setDout(true) // Set digital output to 1

            // Set a timeout to reset the digital output after 2 seconds
            setTimeout(() => {
                setDout(false) // Reset digital output to 0
                setIsRestartAck(false) // Set isRestartAck back to false
            }, 2000)

            // Set isRestartAck to true to prevent multiple resets at the same time
            setIsRestartAck(true)
        }
    }

    const normalised_labels = safetyDins?.map(
        (config, index) => labels[index] || config.name || index.toString()
    )
    const normalised_types = safetyDins?.map((config, index) => config.type)

    return (
        <StyledSafetyTileContent>
            {safetyDins &&
                safetyDins.map(
                    (config, index) =>
                        normalised_types[index] !== 1 && (
                            <StyledSafetyInput key={index}>
                                <span className="label">{normalised_labels[index]}</span>
                                <Tag color={safetyValues[index] ? "green" : "red"}>
                                    {safetyValues[index] ? "NO FAULT" : "FAULT"}
                                </Tag>
                            </StyledSafetyInput>
                        )
                )}
            <StyledResetButton>
                <Space>
                    Acknowledge active safety faults to restart the machine:
                    <Button disabled={!resetAckNeeded} size="small" onClick={handleResetClick}>
                        Restart Acknowledge
                    </Button>
                </Space>
            </StyledResetButton>
        </StyledSafetyTileContent>
    )
}
