import React, { useEffect } from "react"
import { Tile, TileEmptyMessage } from "../tiles"
import { KC_KINEMATICSCONFIGURATIONTYPE, useConfig } from "@glowbuzzer/store"
import styled from "styled-components"
import { Radio, Select, Slider } from "antd"
import { StyledControls } from "../util/styled"
import { useLocalStorage } from "../util/LocalStorageHook"
import { JogGotoCartesian } from "./JogGotoCartesian"
import { JogGotoJoint } from "./JogGotoJoint"
import { JogArrowsCartesian } from "./JogArrowsCartesian"
import { JogArrowsJoint } from "./JogArrowsJoint"
import { JogMode } from "./types"

enum JogMoveMode {
    CARTESIAN,
    JOINT
}

const TileInner = styled.div`
    width: 100%;
    height: 100%;
`

const JogCartesianPanel = ({
    jogMode,
    jogSpeed,
    kinematicsConfigurationIndex,
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
                    defaultFrameIndex={defaultFrameIndex}
                />
            )

        case JogMode.GOTO:
            return (
                <JogGotoCartesian
                    jogSpeed={jogSpeed}
                    kinematicsConfigurationIndex={kinematicsConfigurationIndex}
                    defaultFrameIndex={defaultFrameIndex}
                    showRobotConfiguration
                />
            )
    }
}

const JogJointsPanel = ({ jogMode, jogSpeed, kinematicsConfigurationIndex }) => {
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

const JogPanel = ({ jogMoveMode, jogMode, jogSpeed, kinematicsConfigurationIndex }) => {
    const config = useConfig()
    const kcConfig = Object.values(config.kinematicsConfiguration)[kinematicsConfigurationIndex]
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
                    defaultFrameIndex={defaultFrameIndex}
                />
            ) : (
                <TileEmptyMessage>Cartesian kinematics not supported</TileEmptyMessage>
            )
        case JogMoveMode.JOINT:
            return (
                <JogJointsPanel
                    jogMode={jogMode}
                    jogSpeed={jogSpeed}
                    kinematicsConfigurationIndex={kinematicsConfigurationIndex}
                />
            )
    }
}

export const JogTile = () => {
    const [jogSpeed, setJogSpeed] = useLocalStorage("jog.speedPercentage", 100)
    const [jogMoveMode, setJogMoveMode] = useLocalStorage<JogMoveMode>(
        "jog.move",
        JogMoveMode.CARTESIAN
    )
    const [jogMode, setJogMode] = useLocalStorage<JogMode>("jog.mode", JogMode.CONTINUOUS)

    const [selectedKc, setSelectedKc] = useLocalStorage("jog.kc", null)

    const config = useConfig()
    const kcs = Object.keys(config.kinematicsConfiguration)

    const kinematicsConfigurationIndex = Math.max(kcs.indexOf(selectedKc), 0)

    useEffect(() => {
        if (!selectedKc || !kcs.includes(selectedKc)) {
            setSelectedKc(kcs[0])
        }
    }, [kcs, selectedKc, setSelectedKc])

    function update_kc(value) {
        setSelectedKc(value)
    }

    function updateJogStepMode(e) {
        setJogMode(e.target.value)
    }

    function updateJogMoveMode(e) {
        setJogMoveMode(e.target.value)
    }

    return (
        <Tile
            title={"Jogging"}
            controls={
                <StyledControls>
                    {kcs.length > 1 && (
                        <Select
                            size="small"
                            defaultValue={selectedKc}
                            onChange={update_kc}
                            dropdownMatchSelectWidth={true}
                        >
                            {kcs.map(k => (
                                <Select.Option key={k} value={k}>
                                    {k}
                                </Select.Option>
                            ))}
                        </Select>
                    )}
                    &nbsp;
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
                    <div>Jog Speed (%)</div>
                    <Slider value={jogSpeed} min={1} max={100} onChange={setJogSpeed} />
                </>
            }
        >
            <TileInner>
                <JogPanel
                    kinematicsConfigurationIndex={kinematicsConfigurationIndex}
                    jogMoveMode={jogMoveMode}
                    jogMode={jogMode}
                    jogSpeed={jogSpeed}
                />
            </TileInner>
        </Tile>
    )
}
