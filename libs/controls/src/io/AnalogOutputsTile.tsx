import React from "react"
import { Tile } from "../tiles"
import styled from "styled-components"
import { useAnalogOutputList, useAnalogOutputState } from "@glowbuzzer/store"
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

const AnalogOutputItem = ({ index, label }) => {
    const [aout, setAout] = useAnalogOutputState(index)
    return <NumericOutputWidget label={label} {...aout} onChange={setAout} />
}

export const AnalogOutputsTile = ({ labels = [] }) => {
    const aouts = useAnalogOutputList()

    return (
        <Tile title="Analog Outputs">
            <StyledDiv>
                {aouts.map((label, index) => (
                    <AnalogOutputItem key={index} index={index} label={labels[index] || label} />
                ))}
            </StyledDiv>
        </Tile>
    )
}
