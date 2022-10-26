/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { JogMode } from "./types"
import React, { useState } from "react"
import { DockTileWithToolbar, DockToolbar, DockToolbarButtonGroup } from "../dock/DockToolbar"
import { JogModeRadioButtons } from "./JogModeRadioButtons"
import { KinematicsDropdown } from "../kinematics/KinematicsDropdown"
import { JogJointsPanel } from "./JogJointsPanel"

export const JogJointsTile = () => {
    const [jogMode, setJogMode] = useState(JogMode.CONTINUOUS)
    const [kinematicsConfigurationIndex, setKinematicsConfigurationIndex] = useState(0)

    return (
        <DockTileWithToolbar
            toolbar={
                <>
                    <JogModeRadioButtons mode={jogMode} onChange={setJogMode} />
                    <DockToolbarButtonGroup>
                        <KinematicsDropdown
                            value={kinematicsConfigurationIndex}
                            onChange={setKinematicsConfigurationIndex}
                        />
                    </DockToolbarButtonGroup>
                </>
            }
        >
            <JogJointsPanel
                jogMode={jogMode}
                jogSpeed={100}
                kinematicsConfigurationIndex={kinematicsConfigurationIndex}
            />
        </DockTileWithToolbar>
    )
}
