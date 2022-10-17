/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { DockToolbar, DockToolbarButtonGroup } from "../dock/DockToolbar"
import { JogModeRadioButtons } from "./JogModeRadioButtons"
import { KinematicsDropdown } from "../kinematics/KinematicsDropdown"
import { FramesDropdown } from "../frames/FramesDropdown"
import { JogHomeSplitButton } from "./JogHomeSplitButton"

export const JogCartesianToolbar = ({
    jogMode,
    kinematicsConfigurationIndex,
    frameIndex,
    onChangeJogMode,
    onChangeKc,
    onChangeFrame
}) => (
    <DockToolbar>
        <JogHomeSplitButton kinematicsConfigurationIndex={kinematicsConfigurationIndex} />
        <JogModeRadioButtons mode={jogMode} onChange={onChangeJogMode} />
        <DockToolbarButtonGroup>
            <KinematicsDropdown value={kinematicsConfigurationIndex} onChange={onChangeKc} />
        </DockToolbarButtonGroup>
        <DockToolbarButtonGroup>
            <FramesDropdown value={frameIndex} onChange={onChangeFrame} />
        </DockToolbarButtonGroup>
    </DockToolbar>
)
