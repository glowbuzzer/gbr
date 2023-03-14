/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import {JogMode} from "./types"
import React, {useState} from "react"
import {DockToolbarButtonGroup} from "../dock/DockToolbar"
import {JogModeRadioButtons} from "./JogModeRadioButtons"
import {KinematicsDropdown} from "../kinematics/KinematicsDropdown"
import {JogJointsPanel} from "./JogJointsPanel"
import {DockTileWithToolbar} from "../dock/DockTileWithToolbar"
import {StyledTileContent} from "../util/styles/StyledTileContent"
import {JogLimitsToolbarButton} from "./JogLimitsToolbarButton"
import {Tag} from "antd"
import {useKinematics} from "@glowbuzzer/store";

/**
 * The jog joints tile displays all configured joints with jog controls. You can jog the joints in continuous or step mode,
 * and there is also a goto mode where you can enter a target position for each joint. The kinematics configuration can be
 * selected from a dropdown, and also the reference frame.
 */
export const JointJogTile = () => {
    const [jogMode, setJogMode] = useState(JogMode.CONTINUOUS)
    const [kinematicsConfigurationIndex, setKinematicsConfigurationIndex] = useState(0)
    const {isNearSingularity, configuration} = useKinematics(kinematicsConfigurationIndex)

    return (
        <DockTileWithToolbar
            toolbar={
                <>
                    <JogModeRadioButtons mode={jogMode} onChange={setJogMode}/>
                    <DockToolbarButtonGroup>
                        <KinematicsDropdown
                            value={kinematicsConfigurationIndex}
                            onChange={setKinematicsConfigurationIndex}
                        />
                        <JogLimitsToolbarButton
                            kinematicsConfigurationIndex={kinematicsConfigurationIndex}
                        />
                    </DockToolbarButtonGroup>
                    {isNearSingularity && (
                        <Tag color={"red"} style={{float: "right"}}>
                            SINGULARITY
                        </Tag>
                    )}
                </>
            }
        >
            <StyledTileContent>
                <JogJointsPanel
                    jogMode={jogMode}
                    jogSpeed={100}
                    kinematicsConfigurationIndex={kinematicsConfigurationIndex}
                />
            </StyledTileContent>
        </DockTileWithToolbar>
    )
}
