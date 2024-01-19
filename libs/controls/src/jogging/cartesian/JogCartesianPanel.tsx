/*
 * Copyright (c) 2022-2024. Glowbuzzer. All rights reserved
 */

import { JogMode } from "../types"
import { JogStepCartesian } from "./JogStepCartesian"
import { JogGotoCartesian, PositionMode } from "./JogGotoCartesian"
import React from "react"
import { JogTouchCartesian } from "./JogTouchCartesian"

type JogCartesianPanelProps = {
    jogMode: JogMode
    positionMode: PositionMode
    lockXy: boolean
    lockSpeed: boolean
    kinematicsConfigurationIndex: number
    frameIndex: number
    robotConfiguration: number
    disabled: boolean
}

/** @ignore - internal to the jog tile */
export const JogCartesianPanel = (props: JogCartesianPanelProps) => {
    const { jogMode, ...otherProps } = props

    switch (props.jogMode) {
        case JogMode.CONTINUOUS:
            return <JogTouchCartesian {...otherProps} />

        case JogMode.STEP:
            return <JogStepCartesian jogSpeed={100} jogMode={jogMode} {...otherProps} />

        case JogMode.GOTO:
            return <JogGotoCartesian jogSpeed={100} {...otherProps} disabled={false} />
    }
}
