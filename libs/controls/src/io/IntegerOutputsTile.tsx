import React from "react"
import { Tile } from "@glowbuzzer/layout"
import { useIntegerOutputs } from "@glowbuzzer/store"
import { NumericOutputWidget } from "./NumericOutputWidget"
import styled from "styled-components"

const StyledDiv = styled.div`
    padding-top: 20px;

    > div {
        display: flex;
        gap: 10px;
    }

    .output-label {
        flex-grow: 1;
    }
`

export const IntegerOutputsTile = ({ labels = [] }) => {
    const iout = useIntegerOutputs()

    return (
        <Tile title="Integer Outputs">
            <StyledDiv>
                {iout.values.map((v, index) => (
                    <NumericOutputWidget
                        key={index}
                        hookRef={iout}
                        index={index}
                        label={labels[index]}
                    />
                ))}
            </StyledDiv>
        </Tile>
    )
}
