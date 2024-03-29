/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { useIntegerOutputList, useIntegerOutputState } from "@glowbuzzer/store"
import { NumericOutputWidget } from "./NumericOutputWidget"
import styled from "styled-components"
import { StyledTileContent } from "../util/styles/StyledTileContent"

const StyledDiv = styled.div`
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

type IntegerOutputsTileProps = {
    /**
     * Override labels to use for outputs, in the order given in the configuration
     */
    labels?: string[]
}

/**
 * The integer outputs tile allows you to view and control all integer outputs on a machine.
 *
 * By default (in auto mode) integer outputs are controlled by activities, either using the solo activity API
 * or streamed (for example, using G-code M200). However this tile (and the underlying hook) allows
 * you to override an integer output. When an integer output is overridden, the value you specify will
 * be used regardless of any changes from an activity. For example, if you execute some G-code with
 * an M201 code, but have overridden an integer output using this tile, the M200 code will be ignored.
 *
 */
export const IntegerOutputsTile = ({ labels = [] }: IntegerOutputsTileProps) => {
    const aouts = useIntegerOutputList()

    return (
        <StyledTileContent>
            <StyledDiv>
                {aouts?.map(({ name }, index) => (
                    <IntegerOutputItem
                        key={index}
                        index={index}
                        label={labels[index] || name || index}
                    />
                ))}
            </StyledDiv>
        </StyledTileContent>
    )
}
