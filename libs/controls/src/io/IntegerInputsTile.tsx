import React from "react"
import { useIntegerInputs } from "@glowbuzzer/store"
import { Tile } from "@glowbuzzer/layout"
import { Tag } from "antd"
import styled from "@emotion/styled"

const StyledDiv = styled.div`
    display: flex;
    justify-content: space-between;
`

export const IntegerInputsTile = ({ labels = [] }) => {
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