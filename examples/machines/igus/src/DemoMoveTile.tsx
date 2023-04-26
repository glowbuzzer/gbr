/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { Button, Space } from "antd"
import { useStream } from "@glowbuzzer/store"
import { Euler, Quaternion } from "three"
import { StyledTileContent } from "../../../../libs/controls/src/util/styles/StyledTileContent"

export const HIGH_BLOCK_Z = 600

export const DemoMoveTile = () => {
    const stream = useStream(0)

    function move_start() {
        return stream.send(api => [
            api.moveToPosition(200, 0, 500).configuration(0).rotationEuler(0, Math.PI, 0).promise()
        ])
    }

    async function move_red() {
        return stream.send(api => [
            api
                .moveToPosition(500, -200, 200)
                .configuration(0)
                .rotationEuler(0, Math.PI, 0)
                .promise(),
            api
                .moveLine(500, -200, 150)
                .rotationEuler(0, Math.PI, Math.PI / 2)
                .promise()
        ])
    }

    async function move_green() {
        return stream.send(api => [
            api.moveToPosition(500, 0, 250).configuration(0).rotationEuler(0, Math.PI, 0).promise(),
            api.moveLine(500, 0, 150).promise()
        ])
    }

    async function move_blue() {
        return stream.send(api => [
            api
                .moveToPosition(500, 200, 200)
                .configuration(0)
                .rotationEuler(0, Math.PI, 0)
                .promise(),
            api.moveLine(500, 200, 150).promise()
        ])
    }

    async function move_pink() {
        return stream.send(api => [
            api
                .moveToPosition(425, 0, HIGH_BLOCK_Z)
                .configuration(0)
                .rotationEuler(0, Math.PI / 2, 0)
                .promise(),
            api
                .moveLine(525, 0, HIGH_BLOCK_Z)
                .rotationEuler(0, Math.PI / 2, Math.PI / 2)
                .promise()
        ])
    }

    async function move_yellow() {
        const p1 = 250
        const p2 = 500 - (Math.sin(Math.PI / 4) * 150) / 2
        const euler = new Euler(-Math.PI / 4, Math.PI / 2, 0, "ZYX")

        const { x, y, z, w } = new Quaternion().setFromEuler(euler)

        return stream.send(api => [
            api
                .moveToPosition(p1, p1, HIGH_BLOCK_Z)
                .configuration(0)
                .rotation(x, y, z, w)
                .promise(),
            api.moveLine(p2, p2, HIGH_BLOCK_Z).promise()
        ])
    }

    return (
        <StyledTileContent>
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
        </StyledTileContent>
    )
}
