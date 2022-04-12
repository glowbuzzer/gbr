import React from "react"
import { useAnalogInputs } from "@glowbuzzer/store"
import { Tile } from "../tiles"
import { Tag } from "antd"
import styled from "styled-components"

const StyledDiv = styled.div`
    display: flex;
    justify-content: space-between;
`

export const AnalogInputsTile = ({ labels = [] }) => {
    const ain = useAnalogInputs()

    return (
        <Tile title="Analog Inputs">
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
