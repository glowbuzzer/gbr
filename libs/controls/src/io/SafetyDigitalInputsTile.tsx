/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { useSafetyDigitalInputList, useSafetyDigitalInputs } from "@glowbuzzer/store"
import { StyledSafetyTileContent } from "../util/styles/StyledTileContent"
import { Tag } from "antd"

import styled from "styled-components"

const StyledSafetyDigitalInput = styled.div`
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

type SafetyDigitalInputsTileProps = {
    /**
     * Override labels to use for inputs, in the order given in the configuration
     */
    labels?: string[]
}

/**
 * The safety digital inputs tile shows a simple view of all current digital input values.
 */
export const SafetyDigitalInputsTile = ({ labels = [] }: SafetyDigitalInputsTileProps) => {
    const dins = useSafetyDigitalInputList()
    const values = useSafetyDigitalInputs()
    
    const normalised_labels = dins?.map(
        (config, index) => labels[index] || config.name || index.toString()
    )

    return (
        <StyledSafetyTileContent>
            {dins &&
                dins.map((config, index) => (
                    <StyledSafetyDigitalInput>
                        <span className="label">{normalised_labels[index]}</span>
                        <Tag color={values[index] ? "green" : "red"}>
                            {values[index] ? "ON" : "OFF"}
                        </Tag>
                    </StyledSafetyDigitalInput>
                ))}
        </StyledSafetyTileContent>
    )
}
