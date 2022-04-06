import React, { useEffect, useState } from "react"
import { Tile, useLocalStorage } from "@glowbuzzer/layout"
import {
    JogDirection,
    JOINT_TYPE,
    JointConfig,
    useConfig,
    useJoint,
    useJointConfig,
    useKinematicsCartesianPosition,
    usePreview,
    useSoloActivity
} from "@glowbuzzer/store"
import styled from "styled-components"
import { Button, Form, Input, Radio, Select, Slider, Space } from "antd"
import { StyledControls } from "../util/styled"
import {
    ArrowDownOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    ArrowUpOutlined
} from "@ant-design/icons"
import { Euler, MathUtils, Quaternion } from "three"
import { Waypoints } from "./Waypoints"

enum JogMoveMode {
    CARTESIAN,
    JOINT,
    GOTO
}

enum JogStepMode {
    CONTINUOUS,
    STEP
}

const TileInner = styled.div`
    width: 100%;
    height: 100%;
    display: flex;

    > div {
        flex-grow: 1;
        flex-basis: 0;
    }
`

const ButtonLayoutDiv = styled.div`
    display: inline-flex;
    flex-direction: column;
    zoom: 0.8;
    padding: 10px;

    div {
        display: flex;
        justify-content: center;
        gap: 44px;
    }
`

const JointSliderDiv = styled.div`
    display: flex;
    gap: 10px;

    .ant-slider {
        flex-grow: 1;
    }
`

const JointSliderReadonly = ({ jc, index }: { jc: JointConfig; index: number }) => {
    // this is separate component so that updates to act pos don't re-render the entire tile
    const joint = useJoint(index)
    const [min, max] =
        jc.jointType === JOINT_TYPE.JOINT_REVOLUTE
            ? [MathUtils.degToRad(jc.negLimit), MathUtils.degToRad(jc.posLimit)]
            : [jc.negLimit, jc.posLimit]

    return (
        <Slider
            step={0.001}
            min={min}
            max={max}
            disabled
            value={joint?.actPos}
            tooltipVisible={false}
        />
    )
}

// TODO: H: remove use of gcode and use solo activity capability instead
export const JogTile = () => {
    const [gotoMode, setGotoMode] = useState(0)
    const [jogSpeed, setJogSpeed] = useLocalStorage("jog.speedPercentage", 100)
    const [jogStep, setJogStep] = useLocalStorage("jog.step", 45)
    const [jogMoveMode, setJogMoveMode] = useLocalStorage<JogMoveMode>(
        "jog.mode",
        JogMoveMode.CARTESIAN
    )
    const [jogStepMode, setJogStepMode] = useLocalStorage<JogStepMode>(
        "jog.step",
        JogStepMode.CONTINUOUS
    )

    const [x, setX] = useLocalStorage("jog.x", 0)
    const [y, setY] = useLocalStorage("jog.y", 0)
    const [z, setZ] = useLocalStorage("jog.z", 0)

    const [a, setA] = useLocalStorage("jog.a", 0)
    const [b, setB] = useLocalStorage("jog.b", 0)
    const [c, setC] = useLocalStorage("jog.c", 0)

    const [selectedKc, setSelectedKc] = useLocalStorage("jog.kc", null)

    const config = useConfig()
    const kcs = Object.keys(config.kinematicsConfiguration)

    useEffect(() => {
        if (!selectedKc || !kcs.includes(selectedKc)) {
            setSelectedKc(kcs[0])
        }
    }, [kcs, selectedKc, setSelectedKc])

    const kc_index = kcs.indexOf(selectedKc) || 0

    const kc_config =
        config.kinematicsConfiguration[selectedKc] || config.kinematicsConfiguration[0]

    const joint_configx = useJointConfig()
    const joints_for_kc = kc_config.participatingJoints.map(jointNum => ({
        index: jointNum,
        config: joint_configx[jointNum]
    }))

    const {
        rotation: { x: qx, y: qy, z: qz, w: qw }
    } = useKinematicsCartesianPosition(selectedKc) || { rotation: { x: 0, y: 0, z: 0, w: 1 } }

    const rotation = new Quaternion(qx, qy, qz, qw)

    // by convention, each solo activity index is bound to corresponding kc by index
    const motion = useSoloActivity(kc_index)

    const preview = usePreview()

    // we scale all limits by the jog speed percent
    const move_params = {
        vmaxPercentage: jogSpeed,
        amaxPercentage: jogSpeed,
        jmaxPercentage: jogSpeed
    }

    function update_kc(value) {
        setSelectedKc(value)
    }

    function update_goto_mode(e) {
        setGotoMode(e.target.value)
    }

    function updateJogStepMode(e) {
        setJogStepMode(e.target.value)
    }

    function updateJogMoveMode(e) {
        setJogMoveMode(e.target.value)
    }

    function updateJogSpeed(e) {
        setJogSpeed(e.target.value)
    }

    function updateJogStep(e) {
        setJogStep(e.target.value)
    }

    function startJog(index, direction: JogDirection) {
        function ortho_vector(axis: number, direction: JogDirection) {
            return axis === index
                ? direction === JogDirection.POSITIVE
                    ? 1
                    : direction === JogDirection.NEGATIVE
                    ? -1
                    : 0
                : 0
        }

        if (jogStepMode === JogStepMode.CONTINUOUS) {
            if (jogMoveMode === JogMoveMode.JOINT) {
                // the moveJointsAtVelocity activity accepts an array of velocities for joints in the kc
                const velos = joints_for_kc.map(({ config }, logical_index) =>
                    logical_index === index
                        ? direction === JogDirection.POSITIVE
                            ? config.vmax
                            : -config.vmax
                        : 0
                )
                console.log(
                    "START JOG, KC=",
                    kc_index,
                    "INDEX=",
                    index,
                    "VELOS",
                    velos,
                    joints_for_kc
                )
                preview.disable()
                return motion
                    .moveJointsAtVelocity(velos)
                    .params(move_params)
                    .promise()
                    .finally(preview.enable)
            } else {
                preview.disable()
                return motion
                    .moveLineAtVelocity(
                        ortho_vector(0, direction),
                        ortho_vector(1, direction),
                        ortho_vector(2, direction)
                    )
                    .params(move_params)
                    .promise()
                    .finally(preview.enable)
            }
            // jogger.setJog(jogMoveMode === JogMoveMode.CARTESIAN ? JogMode.JOGMODE_CARTESIAN : JogMode.JOGMODE_JOINT, index, direction, jogSpeed)
        }
    }

    function stopJog() {
        if (jogStepMode === JogStepMode.CONTINUOUS) {
            return motion.cancel().promise()
        }
    }

    function stepJog(index, direction: JogDirection) {
        if (jogStepMode === JogStepMode.STEP) {
            if (jogMoveMode === JogMoveMode.JOINT) {
                const steps = joints_for_kc.map((_, joint_index) =>
                    joint_index === index
                        ? direction === JogDirection.POSITIVE
                            ? jogStep
                            : -jogStep
                        : 0
                )
                preview.disable()
                return motion
                    .moveJoints(steps)
                    .relative()
                    .params(move_params)
                    .promise()
                    .finally(preview.enable)
            }
        }
    }

    function goto() {
        preview.disable()
        return motion.moveToPosition(x, y, z).params(move_params).promise().finally(preview.enable)
    }

    function gotoX() {
        preview.disable()
        motion.moveToPosition(x).params(move_params).promise().finally(preview.enable)
    }

    function gotoY() {
        preview.disable()
        motion.moveToPosition(undefined, y).params(move_params).promise().finally(preview.enable)
    }

    function gotoZ() {
        preview.disable()
        motion
            .moveToPosition(undefined, undefined, z)
            .params(move_params)
            .promise()
            .finally(preview.enable)
    }

    function goto_waypoint(w) {
        preview.disable()
        return motion
            .moveJoints(w.map(MathUtils.degToRad))
            .params(move_params)
            .promise()
            .finally(preview.enable)
    }

    function gotoA() {
        const euler = new Euler().setFromQuaternion(rotation)
        euler.x = MathUtils.degToRad(a)
        const { x, y, z, w } = new Quaternion().setFromEuler(euler)

        preview.disable()
        return motion
            .moveToPosition()
            .rotation(x, y, z, w)
            .params(move_params)
            .promise()
            .finally(preview.enable)
    }

    function gotoB() {
        // TODO
    }

    function gotoC() {
        // TODO
    }

    function JogButton({ index, direction, children }) {
        return (
            <Button
                onClick={() => stepJog(index, direction)}
                onMouseDown={() => startJog(index, direction)}
                onMouseUp={() => stopJog()}
            >
                {children}
            </Button>
        )
    }

    return (
        <Tile
            title={"Jogging"}
            controls={
                <StyledControls>
                    {kcs.length && (
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
                        <Radio.Button value={JogMoveMode.GOTO}>Go To</Radio.Button>
                    </Radio.Group>
                    &nbsp;
                    <Radio.Group
                        size={"small"}
                        value={jogStepMode}
                        onChange={updateJogStepMode}
                        disabled={jogMoveMode === JogMoveMode.GOTO}
                    >
                        <Radio.Button value={JogStepMode.STEP}>Step</Radio.Button>
                        <Radio.Button value={JogStepMode.CONTINUOUS}>Cont</Radio.Button>
                    </Radio.Group>
                </StyledControls>
            }
        >
            <TileInner>
                {jogMoveMode === JogMoveMode.GOTO ? (
                    <div>
                        <Radio.Group onChange={update_goto_mode} value={gotoMode}>
                            <Radio value={0}>Position</Radio>
                            <Radio value={1}>Orientation</Radio>
                            <Radio value={2}>Waypoint</Radio>
                        </Radio.Group>
                        {
                            {
                                0: (
                                    <div>
                                        <Form
                                            layout="inline"
                                            labelCol={{ span: 8 }}
                                            wrapperCol={{ span: 16 }}
                                        >
                                            <Space align="baseline">
                                                <Input
                                                    type="number"
                                                    value={x}
                                                    onChange={e =>
                                                        setX(Number(e.target.value) || 0)
                                                    }
                                                />
                                                <Button onClick={gotoX}>Go to X</Button>
                                                <Button onClick={() => setX(0)}>Reset</Button>
                                            </Space>
                                            <Space align="baseline">
                                                <Input
                                                    type="number"
                                                    value={y}
                                                    onChange={e =>
                                                        setY(Number(e.target.value) || 0)
                                                    }
                                                />
                                                <Button onClick={gotoY}>Go to Y</Button>
                                                <Button onClick={() => setY(0)}>Reset</Button>
                                            </Space>
                                            <Space align="baseline">
                                                <Input
                                                    type="number"
                                                    value={z}
                                                    onChange={e =>
                                                        setZ(Number(e.target.value) || 0)
                                                    }
                                                />
                                                <Button onClick={gotoZ}>Go to Z</Button>
                                                <Button onClick={() => setZ(0)}>Reset</Button>
                                            </Space>
                                        </Form>
                                        <p>
                                            <Button block={true} onClick={goto}>
                                                Go to XYZ
                                            </Button>
                                        </p>
                                    </div>
                                ),
                                1: (
                                    <div>
                                        <Form
                                            layout="inline"
                                            labelCol={{ span: 8 }}
                                            wrapperCol={{ span: 16 }}
                                        >
                                            <Space align="baseline">
                                                <Input
                                                    type="number"
                                                    value={a}
                                                    onChange={e =>
                                                        setA(Number(e.target.value) || 0)
                                                    }
                                                />
                                                <Button onClick={gotoA}>Go to α</Button>
                                                <Button onClick={() => setX(0)}>Reset</Button>
                                            </Space>
                                            <Space align="baseline">
                                                <Input
                                                    type="number"
                                                    value={b}
                                                    onChange={e =>
                                                        setB(Number(e.target.value) || 0)
                                                    }
                                                />
                                                <Button onClick={gotoB}>Go to β</Button>
                                                <Button onClick={() => setY(0)}>Reset</Button>
                                            </Space>
                                            <Space align="baseline">
                                                <Input
                                                    type="number"
                                                    value={c}
                                                    onChange={e =>
                                                        setC(Number(e.target.value) || 0)
                                                    }
                                                />
                                                <Button onClick={gotoC}>Go to Ɣ</Button>
                                                <Button onClick={() => setZ(0)}>Reset</Button>
                                            </Space>
                                        </Form>
                                        <p>
                                            <Button block={true} onClick={goto}>
                                                Go to αβƔ
                                            </Button>
                                        </p>
                                    </div>
                                ),
                                2: (
                                    <Waypoints
                                        kinematicsConfigurationIndex={0}
                                        onSelect={goto_waypoint}
                                    />
                                )
                            }[gotoMode]
                        }
                        <Form.Item label="Jog Speed %">
                            <Input type="number" value={jogSpeed} onChange={updateJogSpeed} />
                        </Form.Item>
                    </div>
                ) : (
                    <div>
                        {jogMoveMode === JogMoveMode.CARTESIAN ? (
                            <>
                                <ButtonLayoutDiv>
                                    <div>
                                        <JogButton index={1} direction={JogDirection.POSITIVE}>
                                            <ArrowUpOutlined />
                                        </JogButton>
                                    </div>
                                    <div>
                                        <JogButton index={0} direction={JogDirection.NEGATIVE}>
                                            <ArrowLeftOutlined />
                                        </JogButton>
                                        <JogButton index={0} direction={JogDirection.POSITIVE}>
                                            <ArrowRightOutlined />
                                        </JogButton>
                                    </div>
                                    <div>
                                        <JogButton index={1} direction={JogDirection.NEGATIVE}>
                                            <ArrowDownOutlined />
                                        </JogButton>
                                    </div>
                                </ButtonLayoutDiv>
                                <ButtonLayoutDiv>
                                    <div>
                                        <JogButton index={2} direction={JogDirection.POSITIVE}>
                                            <ArrowUpOutlined />
                                        </JogButton>
                                    </div>
                                    <div>
                                        <JogButton index={2} direction={JogDirection.NEGATIVE}>
                                            <ArrowDownOutlined />
                                        </JogButton>
                                    </div>
                                </ButtonLayoutDiv>
                            </>
                        ) : (
                            <>
                                {joints_for_kc.map(
                                    ({ config, index: physical_index }, logical_index) => (
                                        <JointSliderDiv key={logical_index}>
                                            <JogButton
                                                index={logical_index}
                                                direction={JogDirection.NEGATIVE}
                                            >
                                                <ArrowLeftOutlined />
                                            </JogButton>
                                            <JointSliderReadonly
                                                jc={config}
                                                index={physical_index}
                                            />
                                            <JogButton
                                                index={logical_index}
                                                direction={JogDirection.POSITIVE}
                                            >
                                                <ArrowRightOutlined />
                                            </JogButton>
                                        </JointSliderDiv>
                                    )
                                )}
                            </>
                        )}

                        <Form layout="horizontal" labelCol={{ span: 10 }} wrapperCol={{ span: 8 }}>
                            <Form.Item label="Jog Speed %">
                                <Input type="number" value={jogSpeed} onChange={updateJogSpeed} />
                            </Form.Item>
                            <Form.Item label="Step Distance">
                                <Input
                                    type="number"
                                    value={jogStep}
                                    onChange={updateJogStep}
                                    disabled={jogStepMode !== JogStepMode.STEP}
                                />
                            </Form.Item>
                        </Form>
                    </div>
                )}
            </TileInner>
        </Tile>
    )
}
