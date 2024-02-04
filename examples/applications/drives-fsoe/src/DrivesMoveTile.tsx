/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React, { useEffect, useState } from "react"
import { Alert, Button, Checkbox, Input, Space, Tabs, TabsProps } from "antd"
import {
    GbcConstants,
    JointCommand,
    useConnection,
    useJointConfigurationList,
    useMachine,
    useSoloActivity
} from "@glowbuzzer/store"
import { index, number } from "mathjs"

enum Activity {
    NONE,
    OSCILLATING_MOVE,
    MOVE_AT_VELOCITY,
    APPLY_TORQUE
}

export const DrivesMoveTile = () => {
    const [activity, setActivity] = useState(Activity.NONE)
    const [pos, setPos] = useState<number[]>([])
    const [vel, setVel] = useState<number[]>([])
    const [torque, setTorque] = useState<{ value: number; disablePosVel: boolean }[]>([])
    const [count, setCount] = useState(0)

    const connection = useConnection()
    const joints = useJointConfigurationList()
    const api = useSoloActivity(0)
    const { currentState } = useMachine()

    useEffect(() => {
        if (!connection.connected || currentState !== "OPERATION_ENABLED") {
            api.cancel()
            setActivity(Activity.NONE)
        }
    }, [connection.connected, currentState])

    useEffect(() => {
        if (joints.length !== pos.length) {
            setPos(joints.map(() => 0))
        }
        if (joints.length !== vel.length) {
            setVel(joints.map(() => 0))
        }
        if (joints.length !== torque.length) {
            setTorque(
                joints.map(() => ({
                    value: 0,
                    disablePosVel: false
                }))
            )
        }
    }, [joints])

    useEffect(() => {
        switch (activity) {
            case Activity.OSCILLATING_MOVE:
                console.log("Starting oscillating move")
                api.moveJoints(pos)
                    .promise()
                    .then(move => {
                        if (move.completed) {
                            console.log("Returning oscillating move")
                            return api.moveJoints(pos.map(() => 0)).promise()
                        }
                    })
                    .then(() => setCount(count => count + 1))
                break

            case Activity.MOVE_AT_VELOCITY:
                api.moveJointsAtVelocity(vel)
                    .promise()
                    .finally(() => {})
                break
        }
    }, [activity, count])

    function update_pos(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        setPos(current => {
            return current.map((v, i) => (i === index ? parseFloat(e.target.value) : v))
        })
    }

    function update_vel(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        setVel(current => {
            return current.map((v, i) => (i === index ? parseFloat(e.target.value) : v))
        })
    }

    function update_torque_value(e, index: number) {
        setTorque(current => {
            return current.map((v, i) =>
                i === index ? { value: parseFloat(e.target.value), ...v } : v
            )
        })
    }

    function start_oscillating_move() {
        setActivity(Activity.OSCILLATING_MOVE)
    }

    async function stop_activity() {
        await api.cancel().promise()
        return setActivity(Activity.NONE)
    }

    function start_move_at_velocity() {
        setActivity(Activity.MOVE_AT_VELOCITY)
    }

    function start_apply_torque(values = torque) {
        setActivity(Activity.APPLY_TORQUE)
        const update: Record<number, { command: JointCommand }> = Object.fromEntries(
            joints.map((_, index) => {
                return [
                    index,
                    {
                        command: {
                            setTorque: values[index].value || 0,
                            controlWord: values[index].disablePosVel
                                ? GbcConstants.JOINT_CONTROL_WORD_CST_POS_VEL_DISABLE_BIT
                                : 0
                        } as JointCommand
                    }
                ]
            })
        )

        connection.send(
            JSON.stringify({
                command: {
                    joint: update
                }
            })
        )
    }

    function stop_torque() {
        start_apply_torque(
            joints.map(() => ({
                value: 0,
                disablePosVel: false
            }))
        )
        setActivity(Activity.NONE)
    }

    const idle = activity === Activity.NONE

    function toggle_torque_disable_pos_vel(index: number) {
        setTorque(current => {
            return current.map((v, i) => {
                return i === index ? { ...v, disablePosVel: !v.disablePosVel } : v
            })
        })
    }

    const items: TabsProps["items"] = [
        {
            key: "1",
            label: `Oscillating Move`,
            children: (
                <Space direction="vertical">
                    <div>
                        {joints.map((joint, index) => (
                            <div>
                                <Space key={index}>
                                    <div>{joint.name}</div>
                                    <div>
                                        <Input
                                            disabled={!idle}
                                            type="number"
                                            value={pos[index]}
                                            onChange={e => update_pos(e, index)}
                                        />
                                    </div>
                                </Space>
                            </div>
                        ))}
                    </div>
                    <Space>
                        <Button size="small" onClick={start_oscillating_move} disabled={!idle}>
                            Start
                        </Button>
                        <Button
                            size="small"
                            onClick={stop_activity}
                            disabled={activity !== Activity.OSCILLATING_MOVE}
                        >
                            Stop
                        </Button>
                    </Space>
                </Space>
            )
        },
        {
            key: "2",
            label: `Move At Velocity`,
            children: (
                <Space direction="vertical">
                    <div>
                        {joints.map((joint, index) => (
                            <div>
                                <Space key={index}>
                                    <div>{joint.name}</div>
                                    <div>
                                        <Input
                                            disabled={!idle}
                                            type="number"
                                            value={vel[index]}
                                            onChange={e => update_vel(e, index)}
                                        />
                                    </div>
                                </Space>
                            </div>
                        ))}
                    </div>
                    <Space>
                        <Button size="small" onClick={start_move_at_velocity} disabled={!idle}>
                            Start
                        </Button>
                        <Button
                            size="small"
                            onClick={stop_activity}
                            disabled={activity !== Activity.MOVE_AT_VELOCITY}
                        >
                            Stop
                        </Button>
                    </Space>
                </Space>
            )
        },
        {
            key: "3",
            label: `Apply Torque`,
            children: (
                <Space direction="vertical">
                    <Alert
                        type="error"
                        message="DANGER! IF YOU DISABLE THE POS/VEL CONTROL LOOP YOUR MACHINE MAY FALL UNDER GRAVITY"
                    />
                    <div>Enter values in Nm to apply torque to one or more drives.</div>
                    <div>
                        {joints.map((joint, index) => (
                            <div>
                                <Space key={index}>
                                    <div>{joint.name}</div>
                                    <div>
                                        <Input
                                            disabled={!idle}
                                            type="number"
                                            value={torque[index]?.value}
                                            onChange={e => update_torque_value(e, index)}
                                        />
                                    </div>
                                    <div>
                                        <Checkbox
                                            value={torque[index]?.disablePosVel}
                                            onChange={() => toggle_torque_disable_pos_vel(index)}
                                        >
                                            Disable POS/VEL loop
                                        </Checkbox>
                                    </div>
                                </Space>
                            </div>
                        ))}
                    </div>
                    <Space>
                        <Button size="small" onClick={() => start_apply_torque()} disabled={!idle}>
                            Start
                        </Button>
                        <Button
                            size="small"
                            onClick={stop_torque}
                            disabled={activity !== Activity.APPLY_TORQUE}
                        >
                            Stop
                        </Button>
                    </Space>
                </Space>
            )
        }
    ]

    return (
        <div style={{ margin: "0 10px" }}>
            <Tabs items={items} />
        </div>
    )
}
