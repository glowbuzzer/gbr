/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React, { useEffect, useState } from "react"
import { Button, Input, Space, Tabs, TabsProps } from "antd"
import { useJointConfigurationList, useMachine, useSoloActivity } from "@glowbuzzer/store"

enum Activity {
    NONE,
    OSCILLATING_MOVE,
    MOVE_AT_VELOCITY
}

export const DrivesMoveTile = () => {
    const [activity, setActivity] = useState(Activity.NONE)
    const [pos, setPos] = useState([])
    const [vel, setVel] = useState([])
    const [count, setCount] = useState(0)

    const joints = useJointConfigurationList()
    const api = useSoloActivity(0)
    const { currentState } = useMachine()

    useEffect(() => {
        if (currentState !== "OPERATION_ENABLED") {
            api.cancel()
            setActivity(Activity.NONE)
        }
    }, [currentState])

    useEffect(() => {
        if (joints.length !== pos.length) {
            setPos(joints.map(() => 0))
        }
        if (joints.length !== vel.length) {
            setVel(joints.map(() => 0))
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

    function start_oscillating_move() {
        setActivity(Activity.OSCILLATING_MOVE)
    }

    function stop_activity() {
        return api
            .cancel()
            .promise()
            .then(() => setActivity(Activity.NONE))
    }

    function start_move_at_velocity() {
        setActivity(Activity.MOVE_AT_VELOCITY)
    }

    const idle = activity === Activity.NONE

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
        }
    ]

    return (
        <div style={{ margin: "0 10px" }}>
            <Tabs items={items} />
        </div>
    )
}
