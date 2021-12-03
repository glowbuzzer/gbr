import React from "react"
import { Tile } from "@glowbuzzer/layout"
import styled from "styled-components"
import { useAnalogOutputs } from "@glowbuzzer/store"
import { NumericOutputWidget } from "./NumericOutputWidget"

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

export const AnalogOutputsTile = ({ labels = [] }) => {
    const aout = useAnalogOutputs()

    return (
        <Tile title="Analog Outputs">
            <StyledDiv>
                {aout.values.map((v, index) => (
                    <NumericOutputWidget
                        key={index}
                        hookRef={aout}
                        index={index}
                        label={labels[index]}
                    />
                ))}
            </StyledDiv>
        </Tile>
    )
}
