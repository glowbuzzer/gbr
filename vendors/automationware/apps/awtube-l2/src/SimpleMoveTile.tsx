/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { DockTileDefinitionBuilder, UserCapabilityGuard } from "@glowbuzzer/controls"
import { Button, Input, Space } from "antd"
import { BLENDTYPE, useStream } from "@glowbuzzer/store"
import { SimpleMoveCapability } from "./SimpleMoveCapabilities"

export const SimpleMoveTile = () => {
    const { execute } = useStream(0, {
        blendType: BLENDTYPE.BLENDTYPE_OVERLAPPED
    })

    async function go() {
        await execute(api => [
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
        await execute(api => [
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

    async function go_updown() {
        await execute(api => [
            api
                .moveToPosition()
                .translation(822.212686, 0, 591.427618)
                .rotation(0.881767, 0, 0.471685, 0)
                .configuration(0)
                .promise(),
            ...Array.from({ length: 5 }).flatMap(() => [
                api.moveLine(0, 0, -200).relative().promise(),
                api
                    .moveLine(0, 0, 200)
                    .relative()
                    .promise()
                    .then(r => {
                        console.log("move up completed", JSON.stringify(r))
                    })
            ])
        ])
    }

    return (
        <div style={{ padding: "10px" }}>
            <Space direction="vertical">
                <UserCapabilityGuard
                    capability={SimpleMoveCapability.READ}
                    alternative={<>READ NOT allowed</>}
                >
                    READ IS allowed
                </UserCapabilityGuard>
                <UserCapabilityGuard
                    capability={SimpleMoveCapability.WRITE}
                    alternative={<>WRITE NOT allowed</>}
                >
                    WRITE IS allowed
                </UserCapabilityGuard>
                <UserCapabilityGuard capability={SimpleMoveCapability.READ} disableOnly>
                    <Input type="text" value="READX" />
                </UserCapabilityGuard>
                <UserCapabilityGuard capability={SimpleMoveCapability.WRITE} disableOnly>
                    <Input type="text" value="WRITE" />
                    <Button>DISABLED</Button>
                </UserCapabilityGuard>

                <div>Click the button below to perform move</div>
                <Button size="small" onClick={go}>
                    PERFORM MOVE
                </Button>
                <div>Click the button below to perform move line</div>
                <Button size="small" onClick={go_line}>
                    PERFORM MOVE LINE
                </Button>

                <div>Click the button below to perform move up/down 5 times</div>
                <Button size="small" onClick={go_updown}>
                    PERFORM UP/DOWN
                </Button>
            </Space>
        </div>
    )
}

export const SimpleMoveTileDefinition = DockTileDefinitionBuilder()
    .id("aw-simple-move")
    .name("Simple Move")
    .render(() => <SimpleMoveTile />)
    // .requiresOperationEnabled()
    // .requiresCapability(SimpleMoveCapability.READ)
    .build()
