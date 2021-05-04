import React, { useCallback, useEffect, useState } from "react"
import { SimpleTileDefinition, SimpleTileLayout, Tile } from "@glowbuzzer/layout"
import { ConnectTile, DevToolsTile } from "@glowbuzzer/controls"
import { Button, Space, Tag } from "antd"
import { JogDirection, JogMode, useDigitalInputs, useDigitalOutputs, useJog, useJoints, useSoloActivity } from "@glowbuzzer/store"
import { DigitalInputOverrideTile } from "../components/DigitalInputOverrides"
import { dinLabels } from "./labels"
import { ConveyorsTile } from "../components/ConveyorsTile"
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons"
import { Vector3 } from "three"

/**
 * Simple button that will correctly handle mouse events to ensure jogging is stopped
 * on mouse up or mouse leave (eg. click then drag leave while captured)
 * @param onStart Function to call when button is pressed
 * @param onStop Function to call when button is released
 * @param children Contents of the button
 * @constructor
 */
const JogButton = ({ onStart, onStop, children }) => {
    const [active, setActive] = useState(false)

    function start() {
        setActive(true)
        onStart()
    }

    function stop() {
        if (active) {
            setActive(false)
            onStop()
        }
    }

    return (
        <Button onMouseDown={start} onMouseUp={stop} onMouseLeave={stop}>
            {children}
        </Button>
    )
}

/**
 * Simple representation of a conveyor in the development UI. Displays manual jog arrows, a relative move button, "run until" button, stop and home buttons.
 *
 * @param index Index of the kinematics configuration to control
 * @param step Relative move amount
 * @param magicEyeTrigger If specified, the digital input will be monitored and the conveyor will stop on the rising edge of the trigger
 * @constructor
 */
const ConveyorControl = ({ index, step, magicEyeTrigger = undefined }) => {
    const jogger = useJog(index)
    const joints = useJoints()
    const dins = useDigitalInputs()

    function start_jog_left() {
        jogger.setJog(JogMode.JOGMODE_JOINT, 0, JogDirection.NEGATIVE, 100)
    }

    function start_jog_right() {
        jogger.setJog(JogMode.JOGMODE_JOINT, 0, JogDirection.POSITIVE, 100)
    }

    function move_relative_amount(distance: number) {
        jogger.stepJog(JogMode.JOGMODE_JOINT_STEP, 0, distance < 0 ? JogDirection.NEGATIVE : JogDirection.POSITIVE, 100, Math.abs(distance))
    }

    function move_relative() {
        move_relative_amount(step)
    }

    function home() {
        move_relative_amount(-joints[0].actPos)
    }

    // this needs to be a callback (memoised function) to avoid triggering the useEffect hook on every render
    const stop_jog = useCallback(() => {
        jogger.setJog(JogMode.JOGMODE_JOINT, 0, JogDirection.NONE, 100)
    }, [jogger])

    const magic_eye = dins[magicEyeTrigger]
    useEffect(() => {
        if (magic_eye) {
            stop_jog()
        }
    }, [stop_jog, magic_eye])

    return (
        <div>
            <Space>
                Conveyor {index + 1}
                <JogButton onStart={start_jog_left} onStop={stop_jog}>
                    <ArrowLeftOutlined />
                </JogButton>
                <JogButton onStart={start_jog_right} onStop={stop_jog}>
                    <ArrowRightOutlined />
                </JogButton>
                <Button onClick={move_relative}>Move {step}</Button>
                {magicEyeTrigger !== undefined && <Button onClick={start_jog_right}>Run Until Magic Eye</Button>}
                <Button onClick={stop_jog}>Stop</Button>
                <Button onClick={home}>Home</Button>
            </Space>
        </div>
    )
}

/**
 * Simple representation of a conveyor in the development UI. Displays manual jog arrows, a relative move button, "run until" button, stop and home buttons.
 *
 * @param index Index of the kinematics configuration to control
 * @param step Relative move amount
 * @param magicEyeTrigger If specified, the digital input will be monitored and the conveyor will stop on the rising edge of the trigger
 * @constructor
 */
const ConveyorControlMotion = ({ index, step, magicEyeTrigger = undefined }) => {
    const motion = useSoloActivity(index)
    const joints = useJoints()
    const dins = useDigitalInputs()

    function start_jog_left() {
        return motion.moveAtVelocity([-100])
    }

    function start_jog_right() {
        return motion.moveAtVelocity([100])
    }

    function move_relative_amount(distance: number) {
        return motion.moveLine(new Vector3(distance, 0, 0), true)
    }

    function move_relative() {
        return move_relative_amount(step)
    }

    function home() {
        return motion.moveLine(new Vector3(0, 0, 0))
    }

    // this needs to be a callback (memoised function) to avoid triggering the useEffect hook on every render
    const stop_jog = useCallback(() => {
        return motion.cancel()
    }, [motion])

    const magic_eye = dins[magicEyeTrigger]
    useEffect(() => {
        if (magic_eye) {
            stop_jog()
        }
    }, [stop_jog, magic_eye])

    return (
        <div>
            <Space>
                Conveyor {index + 1}
                <JogButton onStart={start_jog_left} onStop={stop_jog}>
                    <ArrowLeftOutlined />
                </JogButton>
                <JogButton onStart={start_jog_right} onStop={stop_jog}>
                    <ArrowRightOutlined />
                </JogButton>
                <Button onClick={move_relative}>Move {step}</Button>
                {magicEyeTrigger !== undefined && <Button onClick={start_jog_right}>Run Until Magic Eye</Button>}
                <Button onClick={stop_jog}>Stop</Button>
                <Button onClick={home}>Home</Button>
            </Space>
        </div>
    )
}

const DevelopmentUiTile = () => {
    const douts = useDigitalOutputs()
    const dins = useDigitalInputs()

    const extending = douts.values[0]?.actState > 0
    const retracting = douts.values[1]?.actState > 0
    const extended = dins[0]
    const retracted = dins[1]

    const set_dout = useCallback(
        (index, override, state) =>
            douts.update(index, {
                override,
                state
            }),
        [douts]
    )

    function extend() {
        set_dout(0, true, 1)
    }

    function retract() {
        set_dout(1, true, 1)
    }

    useEffect(() => {
        if (extended) {
            set_dout(0, true, 0)
        }
        if (retracted) {
            set_dout(1, true, 0)
        }
    }, [extended, retracted, set_dout])

    return (
        <Tile title="Development UI">
            <Space direction="vertical">
                <Space>
                    <Button onClick={extend} disabled={extending || extended || retracting}>
                        Extend
                    </Button>
                    <Button onClick={retract} disabled={retracting || retracted || extending}>
                        Retract
                    </Button>
                    <Tag>
                        {extended ? "Extended" : extending ? "Extending..." : retracted ? "Retracted" : retracting ? "Retracting..." : "Unknown"}
                    </Tag>
                </Space>
                <h2>Conveyor control using jogging API</h2>
                <ConveyorControl index={0} step={200} magicEyeTrigger={2} />
                <ConveyorControl index={1} step={100} />

                <h2>Conveyor control using motion API</h2>
                <ConveyorControlMotion index={0} step={200} magicEyeTrigger={2} />
                <ConveyorControlMotion index={1} step={100} />
            </Space>
        </Tile>
    )
}

export const DevelopmentUi = () => {
    const tiles: SimpleTileDefinition[][] = [
        [
            { render: <ConnectTile />, height: 4, title: "Connection" },
            { render: <DevToolsTile />, height: 4, title: "Dev Tools" },
            { render: <DigitalInputOverrideTile labels={dinLabels} />, height: 4, title: "Dev Tools" }
        ],
        [
            { render: <DevelopmentUiTile />, height: 4, title: "Development UI" },
            { render: <ConveyorsTile />, height: 4, title: "Conveyors" }
        ]
    ]

    return <SimpleTileLayout appId="convmc-devel" tiles={tiles} widths={[2, 6]} />
}
