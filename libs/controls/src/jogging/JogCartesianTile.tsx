/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { JogMode } from "./types"
import React, { useState } from "react"
import { JogArrowsCartesian } from "./JogArrowsCartesian"
import { JogGotoCartesian } from "./JogGotoCartesian"
import { JogCartesianPanel } from "./JogCartesianPanel"
import { JogModeRadioButtons } from "./JogModeRadioButtons"
import { DockTileWithToolbar, DockToolbar, DockToolbarButtonGroup } from "../dock/DockToolbar"
import { KinematicsDropdown } from "../kinematics/KinematicsDropdown"
import { FramesDropdown } from "../frames/FramesDropdown"
import { JogHomeSplitButton } from "./JogHomeSplitButton"

export const JogCartesianTile = () => {
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
