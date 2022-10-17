/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { useEffect } from "react"
import { Tile } from "../tiles"
import {
    KC_KINEMATICSCONFIGURATIONTYPE,
    useConfig,
    useKinematicsConfigurationList
} from "@glowbuzzer/store"
import styled from "styled-components"
import { Radio } from "antd"
import { StyledControls } from "../util/styled"
import { useLocalStorage } from "../util/LocalStorageHook"
import { JogGotoCartesian } from "./JogGotoCartesian"
import { JogGotoJoint } from "./JogGotoJoint"
import { JogArrowsCartesian } from "./JogArrowsCartesian"
import { JogArrowsJoint } from "./JogArrowsJoint"
import { JogMode } from "./types"
import { KinematicsConfigurationSelector } from "../misc/KinematicsConfigurationSelector"
import { JogLimitsCheckbox } from "./JogLimitsCheckbox"

const help = (
    <div>
        <h4>Jog Tile</h4>
        <p>The Jog Tile allows the user to manually move their machine.</p>
        <p>There are three main jog modes:</p>
        <ol>
            <li>Joint jog - where individual joints are moved</li>
            <li>
                Cartesian jog - where the "tool" of a machine is moved in cartesian space (position
                & orientation)
            </li>
            <li>
                Goto - where joints are moved to specified angles/positions or the the "tool" of a
                machine is moves to a specific position/orientation in cartesian space
            </li>
        </ol>
        <p>
            Joint jog and Cartesian jog can be executed in step jog mode where the machine moves a
            fixed (specified) distance
        </p>
        <p>
            on each click of the button or in continous mode where the machine moves as long as the
            button is held down.
        </p>
        <p>
            For cartesian jogging or goto the kinematics configuration (kc) must be specified as
            each kc can be moved independently.
        </p>
        <p>
            For joint jog, the kc that contains the joint you want to move must be selected in the
            kc drop down
        </p>
        <p>
            If the limits checkbox is checked in the Jog Tile it is not possibled to move beyond the
            limits defined in the machine's configuration.
        </p>
    </div>
)

enum JogMoveMode {
    CARTESIAN,
    JOINT
}

const TileInner = styled.div`
    width: 100%;
    height: 100%;
`

export const JogCartesianPanel = ({
    jogMode,
    jogSpeed,
    kinematicsConfigurationIndex,
    onChangeKinematicsConfigurationIndex,
    defaultFrameIndex
}) => {
    switch (jogMode) {
        case JogMode.CONTINUOUS:
        case JogMode.STEP:
            return (
                <JogArrowsCartesian
                    jogMode={jogMode}
                    jogSpeed={jogSpeed}
                    kinematicsConfigurationIndex={kinematicsConfigurationIndex}
                    onChangeKinematicsConfigurationIndex={onChangeKinematicsConfigurationIndex}
                    defaultFrameIndex={defaultFrameIndex}
                />
            )

        case JogMode.GOTO:
            return (
                <JogGotoCartesian
                    jogSpeed={jogSpeed}
                    kinematicsConfigurationIndex={kinematicsConfigurationIndex}
                    onChangeKinematicsConfigurationIndex={onChangeKinematicsConfigurationIndex}
                    defaultFrameIndex={defaultFrameIndex}
                    showRobotConfiguration
                />
            )
    }
}

export const JogJointsPanel = ({
    jogMode,
    jogSpeed,
    kinematicsConfigurationIndex,
    onChangeKinematicsConfigurationIndex
}) => {
    switch (jogMode) {
        case JogMode.CONTINUOUS:
        case JogMode.STEP:
            return (
                <JogArrowsJoint
                    jogMode={jogMode}
                    jogSpeed={jogSpeed}
                    kinematicsConfigurationIndex={kinematicsConfigurationIndex}
                    onChangeKinematicsConfigurationIndex={onChangeKinematicsConfigurationIndex}
                />
            )
        case JogMode.GOTO:
            return (
                <JogGotoJoint
                    jogSpeed={jogSpeed}
                    kinematicsConfigurationIndex={kinematicsConfigurationIndex}
                    onChangeKinematicsConfigurationIndex={onChangeKinematicsConfigurationIndex}
                />
            )
    }
}

const CartesianNotSupported = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    gap: 10px;
    justify-content: center;
    align-items: center;
    text-align: center;

    .message {
        font-weight: bold;
    }

    //font-weight: bold;
`

const JogPanel = ({
    jogMoveMode,
    jogMode,
    jogSpeed,
    kinematicsConfigurationIndex,
    onChangeKinematicsConfigurationIndex
}) => {
    const config = useConfig()
    const kcConfig = config.kinematicsConfiguration[kinematicsConfigurationIndex]
    const defaultFrameIndex = kcConfig.frameIndex

    const supports_cartesian =
        kcConfig.kinematicsConfigurationType !== KC_KINEMATICSCONFIGURATIONTYPE.KC_NAKED

    switch (jogMoveMode) {
        case JogMoveMode.CARTESIAN:
            return supports_cartesian ? (
                <JogCartesianPanel
                    jogMode={jogMode}
                    jogSpeed={jogSpeed}
                    kinematicsConfigurationIndex={kinematicsConfigurationIndex}
                    onChangeKinematicsConfigurationIndex={onChangeKinematicsConfigurationIndex}
                    defaultFrameIndex={defaultFrameIndex}
                />
            ) : (
                <CartesianNotSupported>
                    <div className="message">Cartesian kinematics not supported</div>
                    <div className="select">
                        <div>Select alternative kinematics configuration</div>
                        <div>
                            <KinematicsConfigurationSelector
                                value={kinematicsConfigurationIndex}
                                onChange={onChangeKinematicsConfigurationIndex}
                            />
                        </div>
                    </div>
                </CartesianNotSupported>
            )
        case JogMoveMode.JOINT:
            return (
                <JogJointsPanel
                    jogMode={jogMode}
                    jogSpeed={jogSpeed}
                    kinematicsConfigurationIndex={kinematicsConfigurationIndex}
                    onChangeKinematicsConfigurationIndex={onChangeKinematicsConfigurationIndex}
                />
            )
    }
}

/**
 * The jog tile allows direct movement of your machine, either in joint or cartesian mode.
 *
 * If you have multiple kinematics configurations, you can switch between them.
 * Cartesian jogging is allowed if your kinematics support it.
 *
 * The jog tile uses the solo activity API to perform all moves. Features provided:
 *
 * Movement mode
 *
 * : Choose between joint and cartesian jog. In cartesian mode you can select the reference frame for the move.
 *
 * Action mode
 *
 * : Choose between continuous jog, step or goto mode. When the mode is goto, you have the option
 * of position, orientation or waypoint modes.
 *
 * Waypoints
 *
 * : Choose the goto action mode where you can set or use previously created waypoints.
 *
 * Robot configuration
 *
 * : Choose the goto action mode where you can choose the target configuration (waist, elbow, wrist) for the robot.
 *
 * Jog speed
 *
 * : Jogging speed is controled using the feed rate on the kinematics configuration. See {@link FeedRateTile}.
 *
 * Disable limit checking
 *
 * : Normally GBC will not allow you to jog outside of the machine's limits, set in the configuration.
 * However it can be useful to disable this check if the machine has already gone outside of the soft limits
 * and you need to jog it back into position.
 *
 */
export const JogTile = () => {
    const [jogMoveMode, setJogMoveMode] = useLocalStorage<JogMoveMode>(
        "jog.move",
        JogMoveMode.CARTESIAN
    )
    const [jogMode, setJogMode] = useLocalStorage<JogMode>("jog.mode", JogMode.CONTINUOUS)

    const [selectedKc, setSelectedKc] = useLocalStorage("jog.kc", 0)

    const kcs = useKinematicsConfigurationList()

    useEffect(() => {
        if (!kcs[selectedKc]) {
            setSelectedKc(0)
        }
    }, [kcs, selectedKc, setSelectedKc])

    function updateJogStepMode(e) {
        setJogMode(e.target.value)
    }

    function updateJogMoveMode(e) {
        setJogMoveMode(e.target.value)
    }

    return (
        <Tile
            title={"Jogging"}
            help={help}
            controls={
                <StyledControls>
                    <Radio.Group size={"small"} value={jogMoveMode} onChange={updateJogMoveMode}>
                        <Radio.Button value={JogMoveMode.JOINT}>Joint</Radio.Button>
                        <Radio.Button value={JogMoveMode.CARTESIAN}>Cartesian</Radio.Button>
                    </Radio.Group>
                    &nbsp;
                    <Radio.Group size={"small"} value={jogMode} onChange={updateJogStepMode}>
                        <Radio.Button value={JogMode.STEP}>Step</Radio.Button>
                        <Radio.Button value={JogMode.CONTINUOUS}>Cont</Radio.Button>
                        <Radio.Button value={JogMode.GOTO}>Go To</Radio.Button>
                    </Radio.Group>
                </StyledControls>
            }
            footer={
                <>
                    <JogLimitsCheckbox kinematicsConfigurationIndex={selectedKc} />
                </>
            }
        >
            <TileInner>
                <JogPanel
                    kinematicsConfigurationIndex={selectedKc}
                    onChangeKinematicsConfigurationIndex={setSelectedKc}
                    jogMoveMode={jogMoveMode}
                    jogMode={jogMode}
                    jogSpeed={100}
                />
            </TileInner>
        </Tile>
    )
}
