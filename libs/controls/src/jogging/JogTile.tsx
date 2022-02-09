import React from "react"
import { Tile, useLocalStorage } from "@glowbuzzer/layout"
import {
    JogDirection,
    JOINT_TYPE,
    JointConfig,
    POSITIONREFERENCE,
    useJoint,
    useJointConfig,
    useKinematics,
    useSoloActivity
} from "@glowbuzzer/store"
import styled from "styled-components"
import { Button, Form, Input, Radio, Slider, Space } from "antd"
import { StyledControls } from "../util/styled"
import {
    ArrowDownOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    ArrowUpOutlined
} from "@ant-design/icons"
import { MathUtils } from "three"

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

    // const jogger = useJog(0)
    const joint_config = useJointConfig()
    const motion = useSoloActivity(0)
    const kc = useKinematics(0, 0)

    // we scale all limits by the jog speed percent
    const move_params = {
        vmaxPercentage: jogSpeed,
        amaxPercentage: jogSpeed,
        jmaxPercentage: jogSpeed
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
                const velos = joint_config.map((conf, joint_index) =>
                    joint_index === index
                        ? direction === JogDirection.POSITIVE
                            ? conf.vmax
                            : -conf.vmax
                        : 0
                )
                return motion.moveJointsAtVelocity(velos, move_params).promise()
            } else {
                return motion
                    .moveLineAtVelocity(
                        {
                            vector: {
                                x: ortho_vector(0, direction),
                                y: ortho_vector(1, direction),
                                z: ortho_vector(2, direction)
                            }
                        },
                        move_params
                    )
                    .promise()
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
                const steps = joint_config.map((conf, joint_index) =>
                    joint_index === index
                        ? direction === JogDirection.POSITIVE
                            ? jogStep
                            : -jogStep
                        : 0
                )
                return motion.moveJoints(steps, POSITIONREFERENCE.RELATIVE, move_params).promise()
            }
        }
    }

    function goto() {
        return motion.moveToPosition({ x, y, z }, POSITIONREFERENCE.ABSOLUTE, move_params).promise()
    }

    function gotoX() {
        motion.moveToPosition(
            { x, y: kc.pose.position.y, z: kc.pose.position.z },
            POSITIONREFERENCE.ABSOLUTE,
            move_params
        )
    }

    function gotoY() {
        motion.moveToPosition(
            { x: kc.pose.position.x, y, z: kc.pose.position.z },
            POSITIONREFERENCE.ABSOLUTE,
            move_params
        )
    }

    function gotoZ() {
        motion.moveToPosition(
            { x: kc.pose.position.x, y: kc.pose.position.y, z },
            POSITIONREFERENCE.ABSOLUTE,
            move_params
        )
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
                        <Form layout="inline" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                            <Space align="baseline">
                                <Input
                                    type="number"
                                    value={x}
                                    onChange={e => setX(Number(e.target.value) || 0)}
                                />
                                <Button onClick={gotoX}>Go to X</Button>
                                <Button onClick={() => setX(0)}>Reset</Button>
                            </Space>
                            <Space align="baseline">
                                <Input
                                    type="number"
                                    value={y}
                                    onChange={e => setY(Number(e.target.value) || 0)}
                                />
                                <Button onClick={gotoY}>Go to Y</Button>
                                <Button onClick={() => setY(0)}>Reset</Button>
                            </Space>
                            <Space align="baseline">
                                <Input
                                    type="number"
                                    value={z}
                                    onChange={e => setZ(Number(e.target.value) || 0)}
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
                                {joint_config.map((jc, index) => (
                                    <JointSliderDiv key={index}>
                                        <JogButton index={index} direction={JogDirection.NEGATIVE}>
                                            <ArrowLeftOutlined />
                                        </JogButton>
                                        <JointSliderReadonly jc={jc} index={index} />
                                        <JogButton index={index} direction={JogDirection.POSITIVE}>
                                            <ArrowRightOutlined />
                                        </JogButton>
                                    </JointSliderDiv>
                                ))}
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
