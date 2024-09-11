/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */
// @ts-ignore
import { useEffect, useState } from "react"
import { Button, Space, Tag } from "antd"
import { useStream } from "@glowbuzzer/store"

type DataPoint = {
    t: number
    p: number[]
    v: number[]
}

export const InterpolatedMoveTile = () => {
    const [data, setData] = useState<DataPoint[]>([])
    const { execute } = useStream(0)

    useEffect(() => {
        fetch("/trajectory.csv")
            .then(response => response.text())
            .then(text => {
                const data = text
                    .split("\n")
                    .slice(1)
                    .map(line => line.split(","))
                    .filter(line => line.every(n => n.length > 0))
                    .map(line => line.map(n => parseFloat(n)))
                    .map(line => {
                        const [t, p0, p1, p2, p3, p4, p5, v0, v1, v2, v3, v4, v5] = line
                        return {
                            t,
                            p: [p0, p1, p2, p3, p4, p5],
                            v: [v0, v1, v2, v3, v4, v5]
                        }
                    })

                setData(data)
            })
    }, [])

    async function move_start() {
        const initial = data[0].p
        await execute(api => api.moveJoints(initial))
    }

    async function run() {
        const partial = data.slice(1)
        await execute(api => partial.map(({ p, v }) => api.moveJointsInterpolated(0.1, p, v)))
    }

    return (
        <div style={{ padding: "10px" }}>
            <Space direction="vertical">
                <div>{data.length > 0 && <Tag color="green">Data loaded</Tag>}</div>
                <Space>
                    <Button size="small" onClick={move_start}>
                        MOVE START
                    </Button>
                    <Button size="small" onClick={run}>
                        RUN
                    </Button>
                </Space>
            </Space>
        </div>
    )
}
