/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { DockTileDefinitionBuilder } from "@glowbuzzer/controls"
import { Button, Space } from "antd"
import { useStream } from "@glowbuzzer/store"

export const SimpleMoveTile = () => {
    const { send } = useStream(0)

    async function go() {
        await send(api => [
            api
                .moveToPosition()
                .translation(822.212686, 0, 591.427618)
                .rotation(0.881767, 0, 0.471685, 0)
                .configuration(0)
                .promise(),
            api.moveToPosition(-100).relative().promise(),
            api.moveToPosition(0, 100).relative().promise(),
            api.moveToPosition(100, 0).relative().promise(),
            api.moveToPosition(0, -100).relative().promise()
        ])
    }

    async function go_line() {
        await send(api => [
            api
                .moveToPosition()
                .translation(822.212686, 0, 591.427618)
                .rotation(0.881767, 0, 0.471685, 0)
                .configuration(0)
                .promise(),
            api.moveLine(-100).relative().promise(),
            api.moveLine(0, 100).relative().promise(),
            api.moveLine(100, 0).relative().promise(),
            api.moveLine(0, -100).relative().promise()
        ])
    }

    return (
        <div style={{ padding: "10px" }}>
            <Space direction="vertical">
                <div>Click the button below to perform move</div>
                <Button size="small" onClick={go}>
                    PERFORM MOVE
                </Button>
                <div>Click the button below to perform move line</div>
                <Button size="small" onClick={go_line}>
                    PERFORM MOVE LINE
                </Button>
            </Space>
        </div>
    )
}

export const SimpleMoveTileDefinition = DockTileDefinitionBuilder()
    .id("aw-simple-move")
    .name("Simple Move")
    .render(() => <SimpleMoveTile />)
    .build()
