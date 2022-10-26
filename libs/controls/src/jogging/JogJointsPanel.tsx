/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { JogMode } from "./types"
import { JogArrowsJoint } from "./JogArrowsJoint"
import { JogGotoJoint } from "./JogGotoJoint"
import React from "react"

export const JogJointsPanel = ({ jogMode, jogSpeed, kinematicsConfigurationIndex }) => {
    switch (jogMode) {
        case JogMode.CONTINUOUS:
        case JogMode.STEP:
            return (
                <JogArrowsJoint
                    jogMode={jogMode}
                    jogSpeed={jogSpeed}
                    kinematicsConfigurationIndex={kinematicsConfigurationIndex}
                />
            )
        case JogMode.GOTO:
            return (
                <JogGotoJoint
                    jogSpeed={jogSpeed}
                    kinematicsConfigurationIndex={kinematicsConfigurationIndex}
                />
            )
    }
}
