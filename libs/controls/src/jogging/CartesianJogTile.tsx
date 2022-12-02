/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { JogMode } from "./types"
import React, { useState } from "react"
import { JogArrowsCartesian } from "./JogArrowsCartesian"
import { JogGotoCartesian } from "./JogGotoCartesian"
import { JogCartesianPanel } from "./JogCartesianPanel"
import { JogModeRadioButtons } from "./JogModeRadioButtons"
import { DockToolbar, DockToolbarButtonGroup } from "../dock/DockToolbar"
import { KinematicsDropdown } from "../kinematics/KinematicsDropdown"
import { FramesDropdown } from "../frames/FramesDropdown"
import { JogHomeSplitButton } from "./JogHomeSplitButton"
import { DockTileWithToolbar } from "../dock/DockTileWithToolbar"
import { JogLimitsToolbarButton } from "./JogLimitsToolbarButton"

/**
 * The jog cartesian tile displays jog controls for the cartesian axes. You can jog the axes in continuous or step mode,
 * and there is also a goto mode where you can enter a target position for each axis. The kinematics configuration and
 * reference frame can be selected from a dropdown.
 */
export const CartesianJogTile = () => {
    const [jogMode, setJogMode] = useState(JogMode.CONTINUOUS)
    const [kinematicsConfigurationIndex, setKinematicsConfigurationIndex] = useState(0)
    const [frameIndex, setFrameIndex] = useState(0)

    return (
        <DockTileWithToolbar
            toolbar={
                <>
                    <JogHomeSplitButton
                        kinematicsConfigurationIndex={kinematicsConfigurationIndex}
                    />
                    <JogModeRadioButtons mode={jogMode} onChange={setJogMode} />
                    <DockToolbarButtonGroup>
                        <KinematicsDropdown
                            value={kinematicsConfigurationIndex}
                            onChange={setKinematicsConfigurationIndex}
                        />
                        <FramesDropdown value={frameIndex} onChange={setFrameIndex} />
                        <JogLimitsToolbarButton
                            kinematicsConfigurationIndex={kinematicsConfigurationIndex}
                        />
                    </DockToolbarButtonGroup>
                </>
            }
        >
            <JogCartesianPanel
                jogMode={jogMode}
                kinematicsConfigurationIndex={kinematicsConfigurationIndex}
                frameIndex={frameIndex}
            />
        </DockTileWithToolbar>
    )
}
