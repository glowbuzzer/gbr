/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { ActivityBuilder, usePointsList, useSoloActivity } from "@glowbuzzer/store"
import { StyledTileContent } from "../../libs/controls/src/util/styles/StyledTileContent"
import { Button, Input, Select, Space } from "antd"
import { DockTileDefinitionBuilder } from "@glowbuzzer/controls"
import { useState } from "react"

export const OscillatingMoveTile = () => {
    const points = usePointsList()
    const [start, setStart] = useState(undefined)
    const [end, setEnd] = useState(undefined)
    const [iterations, setIterations] = useState(1)
    const [moveType, setMoveType] = useState(0)
    const [running, setRunning] = useState(false)

    const api = useSoloActivity(0)

    const point_options = points.map((p, index) => ({ key: index, label: p.name, value: index }))
    const move_options = [
        { key: 0, label: "Move to position", value: 0 },
        { key: 1, label: "Move line", value: 1 }
    ]

    async function run() {
        const start_point = points[start]
        const end_point = points[end]

        // simple wrapper to throw exception if move cancelled
        function run_it(m: ActivityBuilder) {
            return m.promise().then(v => {
                if (!v.completed) {
                    throw new Error("Move failed")
                }
            })
        }

        setRunning(true)
        try {
            for (let i = 0; i < iterations; i++) {
                if (moveType === 0) {
                    await run_it(api.moveToPosition().setFromPoint(end_point))
                    await run_it(api.moveToPosition().setFromPoint(start_point))
                } else {
                    await run_it(api.moveLine().setFromPoint(end_point))
                    await run_it(api.moveLine().setFromPoint(start_point))
                }
            }
        } catch (e) {
            // ignore
        } finally {
            setRunning(false)
        }
    }

    async function cancel() {
        return api.cancel().promise()
    }

    return (
        <StyledTileContent>
            <Space direction="vertical">
                <Space>
                    Move from
                    <Select
                        size="small"
                        options={point_options}
                        placeholder="Start point"
                        value={start}
                        onChange={setStart}
                    />
                    to
                    <Select
                        size="small"
                        options={point_options}
                        placeholder="End point"
                        value={end}
                        onChange={setEnd}
                    />
                </Space>
                <Space>
                    Using <Select options={move_options} value={moveType} onChange={setMoveType} />
                </Space>
                <Space>
                    Repeat
                    <Input
                        size={"small"}
                        type="number"
                        style={{
                            width: "50px"
                        }}
                        placeholder="Speed"
                        value={iterations}
                        onChange={v => setIterations(Number(v.target.value))}
                    />
                    times
                </Space>
                <Space>
                    <Button size="small" onClick={run} disabled={running}>
                        Run
                    </Button>
                    <Button size="small" onClick={cancel} disabled={!running}>
                        Cancel
                    </Button>
                </Space>
            </Space>
        </StyledTileContent>
    )
}

export const OscillatingMoveTileDefinition = DockTileDefinitionBuilder()
    .name("Oscillating Move")
    .id("oscillating-move")
    .render(() => <OscillatingMoveTile />)
    .build()
