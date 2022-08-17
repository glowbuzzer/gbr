/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Tile } from "@glowbuzzer/controls"
import { Button, Space } from "antd"
import { useSoloActivity } from "@glowbuzzer/store"
import { Euler, Quaternion, Vector3 } from "three"

export const DemoMoveTile = () => {
    const api = useSoloActivity(0)

    function move_start() {
        return api
            .moveToPosition(200, 0, 500)
            .configuration(0)
            .rotationEuler(0, Math.PI, 0)
            .promise()
    }

    async function move_red() {
        await api
            .moveToPosition(500, -200, 200)
            .configuration(0)
            .rotationEuler(0, Math.PI, 0)
            .promise()

        await api.moveLine(500, -200, 150).promise()
    }

    async function move_green() {
        await api
            .moveToPosition(500, 0, 200)
            .configuration(0)
            .rotationEuler(0, Math.PI, 0)
            .promise()

        // TODO: moveLine doesn't work correctly!
        // await api.moveLine(500, 0, 150).promise()
        await api.moveToPosition(500, 0, 150).configuration(0).promise()
    }

    async function move_blue() {
        await api
            .moveToPosition(500, 200, 200)
            .configuration(0)
            .rotationEuler(0, Math.PI, 0)
            .promise()

        await api.moveLine(500, 200, 150).promise()
    }

    async function move_pink() {
        await api
            .moveToPosition(325, 0, 500)
            .configuration(0)
            .rotationEuler(0, Math.PI / 2, 0)
            .promise()

        // TODO: moveLine doesn't work correctly!
        // await api.moveLine(525, 0, 500).promise()
        await api.moveToPosition(525, 0, 500).configuration(0).promise()
    }

    async function move_yellow() {
        const p1 = 250
        const p2 = 500 - (Math.sin(Math.PI / 4) * 150) / 2
        const euler = new Euler(-Math.PI / 4, Math.PI / 2, 0, "ZYX")

        const { x, y, z, w } = new Quaternion().setFromEuler(euler)
        await api.moveToPosition(p1, p1, 500).configuration(0).rotation(x, y, z, w).promise()
        await api.moveLine(p2, p2, 500).promise()
    }

    return (
        <Tile title={"Move"}>
            <Space>
                <Button onClick={move_start}>Move Start</Button>
                <Button onClick={move_red}>Move Red</Button>
                <Button onClick={move_green}>Move Green</Button>
                <Button onClick={move_blue}>Move Blue</Button>
            </Space>
            <Space>
                <Button onClick={move_pink}>Move Pink</Button>
                <Button onClick={move_yellow}>Move Yellow</Button>
            </Space>
        </Tile>
    )
}
