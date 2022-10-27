/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import styled from "styled-components"
import {useAnalogOutputList, useAnalogOutputState} from "@glowbuzzer/store"
import {NumericOutputWidget} from "./NumericOutputWidget"
import {StyledTileContent} from "../util/styles/StyledTileContent"

const StyledDiv = styled.div`
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

type AnalogOutputsTileProps = {
    /**
     * Labels to use for outputs, in the order given in the configuration
     */
    labels?: string[]
}

/**
 * The analog outputs tile allows you to view and control all analog outputs on a machine.
 *
 * By default (in auto mode) analog outputs are controlled by activities, either using the solo activity API
 * or streamed (for example, using G-code M201). However this tile (and the underlying hook) allows
 * you to override an analog output. When an analog output is overridden, the value you specify will
 * be used regardless of any changes from an activity. For example, if you execute some G-code with
 * an M201 code, but have overridden an analog output using this tile, the M201 code will be ignored.
 *
 */
export const AnalogOutputsTile = ({ labels = [] }: AnalogOutputsTileProps) => {
    const aouts = useAnalogOutputList()

    return (
        <StyledTileContent>
            <StyledDiv>
                {aouts?.map(({ name }, index) => (
                    <AnalogOutputItem
                        key={index}
                        index={index}
                        label={labels[index] || name || index}
                    />
                ))}
            </StyledDiv>
        </StyledTileContent>
    )
}
