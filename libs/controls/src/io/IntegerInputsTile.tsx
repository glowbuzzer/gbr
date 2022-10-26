/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { Tag } from "antd"
import styled from "styled-components"
import { useIntegerInputList, useIntegerInputState } from "@glowbuzzer/store"
import { StyledTileContent } from "../util/styles/StyledTileContent"

export const IntegerInputsTileHelp = () => (
    <div>
        <h4>Integer Inputs Tile</h4>
        <p>The Integer Inputs Tile shows the "live" value of all of the integer inputs</p>
        <p>that have been configured for a machine.</p>
    </div>
)

const StyledDiv = styled.div`
    display: flex;
    justify-content: space-between;
`

const IntegerInputItem = ({ label, index }) => {
    const ain = useIntegerInputState(index)
    return (
        <StyledDiv key={index}>
            <div>{label}</div>
            <div>
                <Tag>{ain}</Tag>
            </div>
        </StyledDiv>
    )
}

type IntegerInputsTileProps = {
    /**
     * Labels to use for inputs, in the order given in the configuration
     */
    labels?: string[]
}

/**
 * The digital inputs tile shows a simple table of all current digital input values.
 *
 * The labels property allows you to provide meaningful labels to each input.
 */
export const IntegerInputsTile = ({ labels = [] }: IntegerInputsTileProps) => {
    const iin = useIntegerInputList()

    return (
        <StyledTileContent>
            {iin?.map(({ name }, index) => (
                <IntegerInputItem
                    key={index}
                    index={index}
                    label={labels[index] || name || index}
                />
            ))}
        </StyledTileContent>
    )
}
