import { useSoloActivity } from "@glowbuzzer/store"
import { Vector3 } from "three"
import React, { useCallback, useState } from "react"
import { Button, Space } from "antd"
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons"

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
 * @constructor
 */
export const ConveyorControlMotion = ({ index, step }) => {
    const motion = useSoloActivity(index)

    function start_jog_left() {
        return motion.moveJointsAtVelocity([-50]).promise()
    }

    function start_jog_right() {
        return motion.moveJointsAtVelocity([50]).promise()
    }

    function move_relative_amount(distance: number) {
        return motion.moveLine(new Vector3(distance, 0, 0), true).promise()
    }

    function move_relative() {
        return move_relative_amount(step)
    }

    function home() {
        return motion.moveLine(new Vector3(0, 0, 0)).promise()
    }

    const stop_conveyor_motion = useCallback(() => {
        return motion.cancel().promise()
    }, [motion])

    return (
        <div>
            <Space>
                Conveyor {index + 1}
                <JogButton onStart={start_jog_left} onStop={stop_conveyor_motion}>
                    <ArrowLeftOutlined />
                </JogButton>
                <JogButton onStart={start_jog_right} onStop={stop_conveyor_motion}>
                    <ArrowRightOutlined />
                </JogButton>
                <Button onClick={move_relative}>Move {step}</Button>
                <Button onClick={start_jog_right}>Run</Button>
                <Button onClick={stop_conveyor_motion}>Stop</Button>
                <Button onClick={home}>Home</Button>
            </Space>
        </div>
    )
}
