/*
 * Copyright (c) 2022-2024. Glowbuzzer. All rights reserved
 */

import { JogMode } from "../types"
import React, { useContext, useEffect, useState } from "react"
import { PositionMode } from "./JogGotoCartesian"
import { JogCartesianPanel } from "./JogCartesianPanel"
import { JogModeRadioButtons } from "../JogModeRadioButtons"
import { DockToolbarButtonGroup } from "../../dock"
import { KinematicsDropdown } from "../../kinematics/KinematicsDropdown"
import { FramesDropdown } from "../../frames"
import { JogHomeSplitButton } from "../JogHomeSplitButton"
import { DockTileWithToolbar } from "../../dock/DockTileWithToolbar"
import { JogLimitsToolbarButton } from "../JogLimitsToolbarButton"
import { JogTileItem } from "../util"
import { Radio, Tag } from "antd"
import { useKinematics, useKinematicsConfiguration } from "@glowbuzzer/store"
import { RobotConfigurationSelector } from "../../misc/RobotConfigurationSelector"
import { GlowbuzzerIcon } from "../../util/GlowbuzzerIcon"
import { useLocalStorage } from "../../util/LocalStorageHook"
import { XyIcon } from "../../icons/XyIcon"
import { ReactComponent as SpeedIcon } from "@material-symbols/svg-400/outlined/speed.svg"
import DisabledContext, { DisabledContextProvider } from "antd/es/config-provider/DisabledContext"

/**
 * The jog cartesian tile displays jog controls for the cartesian axes. You can jog the axes in continuous or step mode,
 * and there is also a goto mode where you can enter a target position for each axis. The kinematics configuration and
 * reference frame can be selected from a dropdown.
 */
export const CartesianJogTile = () => {
    const [jogMode, setJogMode] = useLocalStorage("jog.mode", JogMode.CONTINUOUS)
    const [positionMode, setPositionMode] = useLocalStorage(
        "jog.position.mode",
        PositionMode.POSITION
    )
    const [lockXy, setLockXy] = useLocalStorage("jog.lock.xy", false)
    const [lockSpeed, setLockSpeed] = useLocalStorage("jog.lock.speed", false)
    const [robotConfiguration, setRobotConfiguration] = useState(0)

    const [kinematicsConfigurationIndex, setKinematicsConfigurationIndex] = useState(0)
    const [frameIndex, setFrameIndex] = useState(0)

    const { supportedConfigurationBits } = useKinematicsConfiguration(kinematicsConfigurationIndex)
    const { isNearSingularity, configuration } = useKinematics(kinematicsConfigurationIndex)
    const disabled = useContext(DisabledContext)

    useEffect(() => {
        setRobotConfiguration(configuration)
    }, [configuration])

    return (
        <DisabledContextProvider disabled={disabled || !!isNearSingularity}>
            <DockTileWithToolbar
                toolbar={
                    <>
                        <JogHomeSplitButton
                            kinematicsConfigurationIndex={kinematicsConfigurationIndex}
                            frameIndex={frameIndex}
                        />
                        <JogModeRadioButtons mode={jogMode} onChange={setJogMode} />
                        {jogMode === JogMode.CONTINUOUS && (
                            <DockToolbarButtonGroup>
                                <GlowbuzzerIcon
                                    useFill={true}
                                    Icon={XyIcon}
                                    button
                                    title="Lock XY"
                                    checked={lockXy}
                                    onClick={() => setLockXy(!lockXy)}
                                />
                                <GlowbuzzerIcon
                                    useFill={true}
                                    Icon={SpeedIcon}
                                    button
                                    title="Lock Full Speed"
                                    checked={lockSpeed}
                                    onClick={() => setLockSpeed(!lockSpeed)}
                                />
                            </DockToolbarButtonGroup>
                        )}
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
                        {isNearSingularity ? (
                            <Tag color={"red"} style={{ float: "right" }}>
                                SINGULARITY
                            </Tag>
                        ) : null}
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
                    lockXy={lockXy}
                    lockSpeed={lockSpeed}
                    kinematicsConfigurationIndex={kinematicsConfigurationIndex}
                    robotConfiguration={robotConfiguration}
                    frameIndex={frameIndex}
                />
            </DockTileWithToolbar>
        </DisabledContextProvider>
    )
}
