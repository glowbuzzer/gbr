/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { Tile } from "../tiles"
import { useIntegerOutputList, useIntegerOutputState } from "@glowbuzzer/store"
import { NumericOutputWidget } from "./NumericOutputWidget"
import styled from "styled-components"

const help = (
    <div>
        <h4>Integer Outputs Tile</h4>
        <p>The Integer Outputs Tile allows you to control analog outputs on your machine.</p>
        <p>
            If you want your outputs to be controlled by your programs (or gcode) then set "Auto"
            mode in the dropdown.{" "}
        </p>
        <p>
            If you want to force the value of the output from the Tile, set "Override" mode in the
            dropdown.
        </p>
        <p>
            In overide mode the value can be changed by specifying it the box and using the arrow
            button to trigger the set operation.
        </p>
        <p>The current value of the output will be shown in the indicator on the far right.</p>
    </div>
)

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
     * Labels to use for outputs, in the order given in the configuration
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
        <Tile title={"Integer Outputs"} help={help}>
            <StyledDiv>
                {aouts?.map(({ name }, index) => (
                    <IntegerOutputItem
                        key={index}
                        index={index}
                        label={labels[index] || name || index}
                    />
                ))}
            </StyledDiv>
        </Tile>
    )
}
