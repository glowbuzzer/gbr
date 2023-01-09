/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { JogMode } from "./types"
import { JogArrowsCartesian } from "./JogArrowsCartesian"
import { JogGotoCartesian, PositionMode } from "./JogGotoCartesian"
import React from "react"

type JogCartesianPanelProps = {
    jogMode: JogMode
    positionMode: PositionMode
    kinematicsConfigurationIndex: number
    frameIndex: number
    disabled: boolean
}

/** @ignore - internal to the jog tile */
export const JogCartesianPanel = (props: JogCartesianPanelProps) => {
    const { jogMode, ...otherProps } = props

    switch (props.jogMode) {
        case JogMode.CONTINUOUS:
        case JogMode.STEP:
            return <JogArrowsCartesian jogSpeed={100} jogMode={jogMode} {...otherProps} />

        case JogMode.GOTO:
            return <JogGotoCartesian jogSpeed={100} {...otherProps} />
    }
}
