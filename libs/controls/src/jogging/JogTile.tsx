import React from "react"
import { Tile, useLocalStorage } from "@glowbuzzer/layout"
import { JogDirection, JogMode, useJog, useJoints } from "@glowbuzzer/store"
import styled from "styled-components"
import { Button, Form, Input, Radio } from "antd"
import { StyledControls } from "../util/styled"
import { ArrowDownOutlined, ArrowLeftOutlined, ArrowRightOutlined, ArrowUpOutlined } from "@ant-design/icons"

const TileInner = styled.div`
    width: 100%;
    height: 100%;
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

    const jogger = useJog(0)
    const joints = useJoints()

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
        console.log(e)
        // setJogSpeed(e.value)
    }

    function updateJogStep(e) {
        console.log(e)
        // setJogStep(v.value)
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
                <ButtonLayoutDiv>
                    <div>
                        <Button>
                            <ArrowUpOutlined
                                onMouseDown={() => startJog(1, JogDirection.POSITIVE)}
                                onMouseUp={() => stopJog(1)}
                                onClick={() => stepJog(1, JogDirection.POSITIVE)}
                            />
                        </Button>
                    </div>
                    <div>
                        <Button>
                            <ArrowLeftOutlined
                                onMouseDown={() => startJog(0, JogDirection.NEGATIVE)}
                                onMouseUp={() => stopJog(0)}
                                onClick={() => stepJog(0, JogDirection.NEGATIVE)}
                            />
                        </Button>
                        <Button>
                            <ArrowRightOutlined
                                onMouseDown={() => startJog(0, JogDirection.POSITIVE)}
                                onMouseUp={() => stopJog(0)}
                                onClick={() => stepJog(0, JogDirection.POSITIVE)}
                            />
                        </Button>
                    </div>
                    <div>
                        <Button>
                            <ArrowDownOutlined
                                onMouseDown={() => startJog(1, JogDirection.NEGATIVE)}
                                onMouseUp={() => stopJog(1)}
                                onClick={() => stepJog(1, JogDirection.NEGATIVE)}
                            />
                        </Button>
                    </div>
                </ButtonLayoutDiv>
                <ButtonLayoutDiv>
                    <div>
                        <Button>
                            <ArrowUpOutlined />
                        </Button>
                    </div>
                    <div>
                        <Button>
                            <ArrowDownOutlined />
                        </Button>
                    </div>
                </ButtonLayoutDiv>

                <Form layout="inline" wrapperCol={{ span: 6 }}>
                    <Form.Item label="Jog Speed %">
                        <Input type="number" value={jogSpeed} onChange={updateJogSpeed} />
                    </Form.Item>
                    {jogMode === JogMode.JOGMODE_JOINT_STEP && (
                        <Form.Item label="Step Distance">
                            <Input type="number" value={jogStep} onChange={updateJogStep} />
                        </Form.Item>
                    )}
                </Form>
            </TileInner>
        </Tile>
    )
}
