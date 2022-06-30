/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { useAnalogInputs } from "@glowbuzzer/store"
import { Tile } from "../tiles"
import { Tag } from "antd"
import styled from "styled-components"

const help = (
    <div>
        <h4>Analog Inputs Tile</h4>
        <p>The Analog Inputs Tile shows the "live" value of all of the analog inputs</p>
        <p>that have been configured for a machine.</p>
    </div>
)


const StyledDiv = styled.div`
    display: flex;
    justify-content: space-between;
`

type AnalogInputsTileProps = {
    /**
     * Labels to use for inputs, in the order given in the configuration
     */
    labels?: string[]
}

/**
 * The analog inputs tile shows a simple table of all current analog input values.
 */
export const AnalogInputsTile = ({ labels = [] }: AnalogInputsTileProps) => {
    const ain = useAnalogInputs()

    return (
        <Tile title="Analog Inputs" help={help}>
            {ain.map((item, index) => (
                <StyledDiv key={index}>
                    <div>{labels[index] || "Unknown"}</div>
                    <div>
                        <Tag>{item}</Tag>
                    </div>
                </StyledDiv>
            ))}
        </Tile>
    )
}
