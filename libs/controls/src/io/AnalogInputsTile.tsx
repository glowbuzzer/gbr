/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { Tag } from "antd"
import styled from "styled-components"
import { useAnalogInputList, useAnalogInputState } from "@glowbuzzer/store"
import { StyledTileContent } from "../util/styles/StyledTileContent"

const StyledDiv = styled.div`
    display: flex;
    justify-content: space-between;
`

const AnalogInputItem = ({ label, index }) => {
    const ain = useAnalogInputState(index)
    return (
        <StyledDiv key={index}>
            <div>{label}</div>
            <div>
                <Tag>{ain}</Tag>
            </div>
        </StyledDiv>
    )
}

type AnalogInputsTileProps = {
    /**
     * Override labels to use for inputs, in the order given in the configuration
     */
    labels?: string[]
}

/**
 * The analog inputs tile shows a simple table of all current analog input values.
 */
export const AnalogInputsTile = ({ labels = [] }: AnalogInputsTileProps) => {
    const ain = useAnalogInputList()

    return (
        <StyledTileContent>
            {ain?.map((config, index) => (
                <AnalogInputItem
                    key={index}
                    index={index}
                    label={labels[index] || config.name || index}
                />
            ))}
        </StyledTileContent>
    )
}
