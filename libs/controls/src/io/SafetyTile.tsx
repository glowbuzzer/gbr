/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { useState } from "react"
import {
    DIN_SAFETY_TYPE,
    useDigitalInputList,
    useDigitalInputs,
    useDigitalOutputState,
    useSafetyDigitalInputList,
    useSafetyDigitalInputs,
    useSafetyDigitalInputState,
    useSafetyDigitalOutputList,
    useSafetyDigitalOutputState
} from "@glowbuzzer/store"
import {
    StyledSafetyTileContent,
    StyledSafetyTileText,
    StyledDivider
} from "../util/styles/StyledTileContent"
import { Tag, Select, Switch, Button, Space, Divider } from "antd"
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
    const safetyDins = useSafetyDigitalInputList()
    const safetyValues = useSafetyDigitalInputs()
    const [isRestartAck, setIsRestartAck] = useState(false)

    // safety Din 2 is used to signal that a restart acknowledge is needed
    const resetAckNeeded = useSafetyDigitalInputState(2)

    const safePosValidIndex = safetyDins?.findIndex(
        c => c.type === DIN_SAFETY_TYPE.DIN_SAFETY_TYPE_SAFE_POS_VALID
    )

    const overallSafetyStateIndex = safetyDins?.findIndex(
        c => c.type === DIN_SAFETY_TYPE.DIN_SAFETY_TYPE_OVERALL_STATE
    )

    const normalised_labels = safetyDins?.map(
        (config, index) => labels[index] || config.name || index.toString()
    )
    const normalised_types = safetyDins?.map((config, index) => config.type)

    return (
        <StyledSafetyTileContent>
            The overall safety state is:{"  "}
            <Tag color={safetyValues[overallSafetyStateIndex] ? "green" : "red"}>
                {safetyValues[overallSafetyStateIndex] ? "NO FAULT" : "FAULT"}
            </Tag>
            <StyledDivider />
            <StyledSafetyTileText>The acknowledgeable safety faults are:</StyledSafetyTileText>
            {safetyDins &&
                safetyDins.map(
                    (config, index) =>
                        normalised_types[index] ==
                            DIN_SAFETY_TYPE.DIN_SAFETY_TYPE_ACKNOWLEDGEABLE && (
                            <StyledSafetyInput key={index}>
                                <span className="label">{normalised_labels[index]}</span>
                                <Tag color={safetyValues[index] ? "green" : "red"}>
                                    {safetyValues[index] ? "NO FAULT" : "FAULT"}
                                </Tag>
                            </StyledSafetyInput>
                        )
                )}
            <StyledDivider />
            <StyledSafetyTileText>The unacknowledgeable safety faults are:</StyledSafetyTileText>
            {safetyDins &&
                safetyDins.map(
                    (config, index) =>
                        normalised_types[index] ==
                            DIN_SAFETY_TYPE.DIN_SAFETY_TYPE_UNACKNOWLEDGEABLE && (
                            <StyledSafetyInput key={index}>
                                <span className="label">{normalised_labels[index]}</span>
                                <Tag color={safetyValues[index] ? "green" : "red"}>
                                    {safetyValues[index] ? "NO FAULT" : "FAULT"}
                                </Tag>
                            </StyledSafetyInput>
                        )
                )}
            <StyledDivider />
            Acknowledgeable safety faults can we reset using the reset button. Unacknowledgeable
            safety faults require?.
            <StyledDivider />
            {safetyDins[safePosValidIndex] ? (
                <div>
                    The robot is reporting that its safe position is valid. No action is needed.
                </div>
            ) : (
                <div>
                    The robot is reporting that its safe position is INVALID. The safe position
                    homing routine must be run.{" "}
                </div>
            )}
        </StyledSafetyTileContent>
    )
}
