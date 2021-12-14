import React from "react"
import { Tile } from "@glowbuzzer/layout"
import { useIntegerOutputList, useIntegerOutputState } from "@glowbuzzer/store"
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

const IntegerOutputItem = ({ index, label }) => {
    const [iout, setIout] = useIntegerOutputState(index)
    return <NumericOutputWidget label={label} {...iout} onChange={setIout} />
}


export const IntegerOutputsTile = ({ labels = [] }) => {
    const aouts = useIntegerOutputList()

    return (
        <Tile title="Integer Outputs">
            <StyledDiv>
                {aouts.map((label, index) => (
                    <IntegerOutputItem index={index} label={labels[index] || label} />
                ))}
            </StyledDiv>
        </Tile>
    )
}
