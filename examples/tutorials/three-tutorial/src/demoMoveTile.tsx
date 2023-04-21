import * as React from "react"
import { useContext, useState } from "react"

import styled from "styled-components"

import { Button, Input, Select, Space } from "antd"
import { ActivityBuilder, usePointsList, useSoloActivity } from "@glowbuzzer/store"
import { StyledTileContent } from "../../../../libs/controls/src/util/styles/StyledTileContent"

export const DemoMoveTile = () => {
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

        try {
            for (let i = 0; i < iterations; i++) {
                if (moveType === 0) {
                    // await run_it(api.moveToPosition().setFromPoint(end_point))
                    // await run_it(api.moveToPosition().setFromPoint(start_point))
                    // await run_it(
                    //     api.moveToPosition().translation(200, -200, -325).rotation(0, 1, 0, 0)
                    // )
                    // await run_it(api.moveLine().translation(200, -200, -375).rotation(0, 1, 0, 0))
                    // await run_it(api.moveLine().translation(200, -200, -325).rotation(0, 1, 0, 0))
                    //
                    // await run_it(
                    //     api.moveToPosition().translation(200, 0, -325).rotation(0, 1, 0, 0)
                    // )
                    // await run_it(api.moveLine().translation(200, 0, -375).rotation(0, 1, 0, 0))
                    // await run_it(api.moveLine().translation(200, 0, -325).rotation(0, 1, 0, 0))
                    //
                    // await run_it(
                    //     api.moveToPosition().translation(200, 200, -325).rotation(0, 1, 0, 0)
                    // )
                    // await run_it(api.moveLine().translation(200, 200, -375).rotation(0, 1, 0, 0))
                    // await run_it(api.moveLine().translation(200, 200, -325).rotation(0, 1, 0, 0))
                    //

                    await run_it(
                        api.moveToPosition().translation(200, -200, -325).rotation(0, 1, 0, 0)
                    )
                    await run_it(api.moveLine().translation(200, -200, -375))
                    await run_it(api.moveLine().translation(200, -200, -325))
                    await run_it(api.moveToPosition().translation(200, 0, -325))
                    await run_it(api.moveLine().translation(200, 0, -375))
                    await run_it(api.moveLine().translation(200, 0, -325))
                    await run_it(api.moveToPosition().translation(200, 200, -325))
                    await run_it(api.moveLine().translation(200, 200, -375))
                    await run_it(api.moveLine().translation(200, 200, -325))

                    // await run_it(api.moveToPosition().translation(200, -200, -325).rotation(0, 1, 0, 0))
                    // await run_it(api.moveToPosition().translation(200, 0, -325))
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

const StyledDiv = styled.div`
    padding: 5px;

    .row {
        &.padded {
            padding: 12px 0;
        }

        padding: 2px 0;
        display: flex;
        justify-content: stretch;
        gap: 20px;
        align-items: center;

        .label {
            flex-grow: 1;
        }
    }

    .ant-radio-group {
        display: flex;
        justify-content: stretch;

        .ant-radio-button-wrapper {
            flex-grow: 1;
            flex-basis: 0;
            text-align: center;
        }

        .ant-radio-button-wrapper:first-child {
            border-radius: 10px 0 0 10px;
        }

        .ant-radio-button-wrapper:last-child {
            border-radius: 0 10px 10px 0;
        }
    }

    .controls {
        min-width: 180px;
        text-align: right;
    }
`
