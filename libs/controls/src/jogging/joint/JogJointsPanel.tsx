/*
 * Copyright (c) 2022-2024. Glowbuzzer. All rights reserved
 */

import { JogMode } from "../types"
import { JogStepJoint } from "./JogStepJoint"
import { JogGotoJoint } from "./JogGotoJoint"
import React from "react"
import { JogTouchJoint } from "./JogTouchJoint"

/** @ignore - internal to the jog tile */
export const JogJointsPanel = ({ jogMode, jogSpeed, kinematicsConfigurationIndex }) => {
    switch (jogMode) {
        case JogMode.CONTINUOUS:
            return <JogTouchJoint kinematicsConfigurationIndex={kinematicsConfigurationIndex} />
        case JogMode.STEP:
            return <JogStepJoint kinematicsConfigurationIndex={kinematicsConfigurationIndex} />
        case JogMode.GOTO:
            return (
                <JogGotoJoint
                    jogSpeed={jogSpeed}
                    kinematicsConfigurationIndex={kinematicsConfigurationIndex}
                />
            )
    }
}
