import React from "react"
import { useIntegerInputs } from "@glowbuzzer/store"
import { Tile } from "../tiles"
import { Tag } from "antd"
import styled from "styled-components"

const StyledDiv = styled.div`
    display: flex;
    justify-content: space-between;
`

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
    const ain = useIntegerInputs()

    return (
        <Tile title="Integer Inputs">
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
