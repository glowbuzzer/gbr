/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { JogMode } from "./types"
import React, { useEffect, useState } from "react"
import { PositionMode } from "./JogGotoCartesian"
import { JogCartesianPanel } from "./JogCartesianPanel"
import { JogModeRadioButtons } from "./JogModeRadioButtons"
import { DockToolbarButtonGroup } from "../dock/DockToolbar"
import { KinematicsDropdown } from "../kinematics/KinematicsDropdown"
import { FramesDropdown } from "../frames"
import { JogHomeSplitButton } from "./JogHomeSplitButton"
import { DockTileWithToolbar } from "../dock/DockTileWithToolbar"
import { JogLimitsToolbarButton } from "./JogLimitsToolbarButton"
import { JogTileItem } from "./util"
import { Radio, Tag } from "antd"
import { useKinematics, useKinematicsConfiguration } from "@glowbuzzer/store"
import { RobotConfigurationSelector } from "../misc/RobotConfigurationSelector"

/**
 * The jog cartesian tile displays jog controls for the cartesian axes. You can jog the axes in continuous or step mode,
 * and there is also a goto mode where you can enter a target position for each axis. The kinematics configuration and
 * reference frame can be selected from a dropdown.
 */
export const CartesianJogTile = () => {
    const [jogMode, setJogMode] = useState(JogMode.CONTINUOUS)
    const [positionMode, setPositionMode] = useState(PositionMode.POSITION)
    const [robotConfiguration, setRobotConfiguration] = useState(0)

    const [kinematicsConfigurationIndex, setKinematicsConfigurationIndex] = useState(0)
    const [frameIndex, setFrameIndex] = useState(0)

    const { isNearSingularity, configuration } = useKinematics(kinematicsConfigurationIndex)
    const { supportedConfigurationBits } = useKinematicsConfiguration(kinematicsConfigurationIndex)

    useEffect(() => {
        setRobotConfiguration(configuration)
    }, [configuration])

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
                    {isNearSingularity && (
                        <Tag color={"red"} style={{ float: "right" }}>
                            SINGULARITY
                        </Tag>
                    )}
                </>
            }
        >
            <JogTileItem>
                <Radio.Group
                    value={positionMode}
                    onChange={e => setPositionMode(e.target.value)}
                    size="small"
                >
                    <Radio.Button value={PositionMode.POSITION}>Position</Radio.Button>
                    <Radio.Button value={PositionMode.ORIENTATION}>Orientation</Radio.Button>
                </Radio.Group>
                {jogMode === JogMode.GOTO && (
                    <RobotConfigurationSelector
                        currentValue={configuration}
                        value={robotConfiguration}
                        supportedConfigurationBits={supportedConfigurationBits}
                        onChange={setRobotConfiguration}
                    />
                )}
            </JogTileItem>

            <JogCartesianPanel
                jogMode={jogMode}
                positionMode={positionMode}
                kinematicsConfigurationIndex={kinematicsConfigurationIndex}
                robotConfiguration={robotConfiguration}
                frameIndex={frameIndex}
                disabled={!!isNearSingularity}
            />
        </DockTileWithToolbar>
    )
}
