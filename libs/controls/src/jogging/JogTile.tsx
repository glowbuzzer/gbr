import React from "react"
import { Tile, useLocalStorage } from "@glowbuzzer/layout"
import { JogDirection, JogMode, useGCode, useJog } from "@glowbuzzer/store"
import styled from "styled-components"
import { Button, Form, Input, Radio, Space } from "antd"
import { StyledControls } from "../util/styled"
import { ArrowDownOutlined, ArrowLeftOutlined, ArrowRightOutlined, ArrowUpOutlined } from "@ant-design/icons"

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

export const JogTile = () => {
    const [jogSpeed, setJogSpeed] = useLocalStorage("jog.speedPercentage", 100)
    const [jogStep, setJogStep] = useLocalStorage("jog.step", 45)
    const [jogMode, setJogMode] = useLocalStorage<JogMode>("jog.mode", JogMode.JOGMODE_JOINT)

    const [x, setX] = useLocalStorage("jog.x", 0)
    const [y, setY] = useLocalStorage("jog.y", 0)
    const [z, setZ] = useLocalStorage("jog.z", 0)

    const jogger = useJog(0)
    const gcode = useGCode()

    function updateJogStepMode(e) {
        switch (jogMode) {
            case JogMode.JOGMODE_NONE:
                break
            case JogMode.JOGMODE_JOINT:
                setJogMode(JogMode.JOGMODE_JOINT_STEP)
                break
            case JogMode.JOGMODE_CARTESIAN:
                setJogMode(JogMode.JOGMODE_CARTESIAN_STEP)
                break
            case JogMode.JOGMODE_JOINT_STEP:
                setJogMode(JogMode.JOGMODE_JOINT)
                break
            case JogMode.JOGMODE_CARTESIAN_STEP:
                setJogMode(JogMode.JOGMODE_CARTESIAN)
                break
            default:
        }
    }

    function updateJogMoveMode(e) {
        switch (jogMode) {
            case JogMode.JOGMODE_NONE:
                break
            case JogMode.JOGMODE_JOINT:
                setJogMode(JogMode.JOGMODE_CARTESIAN)
                break
            case JogMode.JOGMODE_CARTESIAN:
                setJogMode(JogMode.JOGMODE_JOINT)
                break
            case JogMode.JOGMODE_JOINT_STEP:
                setJogMode(JogMode.JOGMODE_CARTESIAN_STEP)
                break
            case JogMode.JOGMODE_CARTESIAN_STEP:
                setJogMode(JogMode.JOGMODE_JOINT_STEP)
                break
            default:
        }
    }

    function updateJogSpeed(e) {
        setJogSpeed(e.target.value)
    }

    function updateJogStep(e) {
        setJogStep(e.target.value)
    }

    function startJog(joint, direction: JogDirection) {
        if (jogMode === JogMode.JOGMODE_JOINT) {
            jogger.setJog(joint, direction, jogSpeed)
        }
    }

    function stopJog(joint) {
        if (jogMode === JogMode.JOGMODE_JOINT) {
            jogger.setJog(joint, JogDirection.NONE, jogSpeed)
        }
    }

    function stepJog(joint, direction: JogDirection) {
        if (jogMode === JogMode.JOGMODE_JOINT_STEP) {
            jogger.stepJog(joint, direction, jogStep)
        }
    }

    const jointMode = jogMode === JogMode.JOGMODE_JOINT_STEP || jogMode === JogMode.JOGMODE_JOINT
    const stepMode = jogMode === JogMode.JOGMODE_JOINT_STEP || jogMode === JogMode.JOGMODE_CARTESIAN_STEP

    function goto() {
        gcode.send(`
            G0 X${x} Y${y} Z${z}
            M2
        `)
    }

    function gotoX() {
        gcode.send(`
            G0 X${x}
            M2
        `)
    }

    function gotoY() {
        gcode.send(`
            G0 Y${y}
            M2
        `)
    }

    function gotoZ() {
        gcode.send(`
            G0 Z${z}
            M2
        `)
    }

    return (
        <Tile
            title={"Jogging"}
            controls={
                <StyledControls>
                    <Radio.Group size={"small"} value={jointMode} onChange={updateJogMoveMode}>
                        <Radio.Button value={true}>Joint</Radio.Button>
                        <Radio.Button value={false}>Cartesian</Radio.Button>
                    </Radio.Group>
                    &nbsp;
                    <Radio.Group size={"small"} value={stepMode} onChange={updateJogStepMode}>
                        <Radio.Button value={true}>Step</Radio.Button>
                        <Radio.Button value={false}>Cont</Radio.Button>
                    </Radio.Group>
                </StyledControls>
            }
        >
            <TileInner>
                <div>
                    <ButtonLayoutDiv>
                        <div>
                            <Button
                                onClick={() => stepJog(1, JogDirection.POSITIVE)}
                                onMouseDown={() => startJog(1, JogDirection.POSITIVE)}
                                onMouseUp={() => stopJog(1)}
                            >
                                <ArrowUpOutlined />
                            </Button>
                        </div>
                        <div>
                            <Button
                                onClick={() => stepJog(0, JogDirection.NEGATIVE)}
                                onMouseDown={() => startJog(0, JogDirection.NEGATIVE)}
                                onMouseUp={() => stopJog(0)}
                            >
                                <ArrowLeftOutlined />
                            </Button>
                            <Button
                                onClick={() => stepJog(0, JogDirection.POSITIVE)}
                                onMouseDown={() => startJog(0, JogDirection.POSITIVE)}
                                onMouseUp={() => stopJog(0)}
                            >
                                <ArrowRightOutlined />
                            </Button>
                        </div>
                        <div>
                            <Button
                                onClick={() => stepJog(1, JogDirection.NEGATIVE)}
                                onMouseDown={() => startJog(1, JogDirection.NEGATIVE)}
                                onMouseUp={() => stopJog(1)}
                            >
                                <ArrowDownOutlined />
                            </Button>
                        </div>
                    </ButtonLayoutDiv>
                    <ButtonLayoutDiv>
                        <div>
                            <Button
                                onClick={() => stepJog(2, JogDirection.POSITIVE)}
                                onMouseDown={() => startJog(2, JogDirection.POSITIVE)}
                                onMouseUp={() => stopJog(2)}
                            >
                                <ArrowUpOutlined />
                            </Button>
                        </div>
                        <div>
                            <Button
                                onClick={() => stepJog(2, JogDirection.NEGATIVE)}
                                onMouseDown={() => startJog(2, JogDirection.NEGATIVE)}
                                onMouseUp={() => stopJog(2)}
                            >
                                <ArrowDownOutlined />
                            </Button>
                        </div>
                    </ButtonLayoutDiv>

                    <Form layout="horizontal" labelCol={{ span: 10 }} wrapperCol={{ span: 8 }}>
                        <Form.Item label="Jog Speed %">
                            <Input type="number" value={jogSpeed} onChange={updateJogSpeed} />
                        </Form.Item>
                        <Form.Item label="Step Distance">
                            <Input
                                type="number"
                                value={jogStep}
                                onChange={updateJogStep}
                                disabled={jogMode !== JogMode.JOGMODE_JOINT_STEP && jogMode !== JogMode.JOGMODE_CARTESIAN_STEP}
                            />
                        </Form.Item>
                    </Form>
                </div>
                <div>
                    <Form layout="inline" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        <Space align="baseline">
                            <Input type="number" value={x} onChange={e => setX(Number(e.target.value) || 0)} />
                            <Button onClick={gotoX}>Go to X</Button>
                            <Button onClick={() => setX(0)}>Reset</Button>
                        </Space>
                        <Space align="baseline">
                            <Input type="number" value={y} onChange={e => setY(Number(e.target.value) || 0)} />
                            <Button onClick={gotoY}>Go to Y</Button>
                            <Button onClick={() => setY(0)}>Reset</Button>
                        </Space>
                        <Space align="baseline">
                            <Input type="number" value={z} onChange={e => setZ(Number(e.target.value) || 0)} />
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
            </TileInner>
        </Tile>
    )
}
