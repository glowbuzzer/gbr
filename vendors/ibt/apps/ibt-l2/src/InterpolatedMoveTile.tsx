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
        fetch("/trajectory2.csv")
            .then(response => response.text())
            .then(text => {
                const data = text
                    .split("\n")
                    .slice(1)
                    .map(line => line.split(","))
                    .filter(line => line.every(n => n.length > 0))
                    .map(line => parseFloat(line[2]))

                const result = []
                let t = 0
                for (let i = 0; i < data.length; i += 3 * 6) {
                    const [
                        p0,
                        v0,
                        _a0,
                        p1,
                        v1,
                        _a1,
                        p2,
                        v2,
                        _a2,
                        p3,
                        v3,
                        _a3,
                        p4,
                        v4,
                        _a4,
                        p5,
                        v5,
                        _a5
                    ] = data.slice(i, i + 3 * 6)

                    result.push({
                        t,
                        p: [p0, p1, p2, p3, p4, p5],
                        v: [v0, v1, v2, v3, v4, v5]
                    })
                    t += 0.1
                }

                console.log("NEW", result)
                setData(result)
            })

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

                console.log("ORIG", data)
                // setData(data)
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
