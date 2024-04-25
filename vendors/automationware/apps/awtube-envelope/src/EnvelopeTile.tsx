/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import { DockTileDefinitionBuilder, PrecisionInput } from "@glowbuzzer/controls"
import { Button, Flex, Space } from "antd"
import { useEnvelopeProvider } from "./provider"
import { useEffect, useState } from "react"
import { useKinematics, useSoloActivity } from "@glowbuzzer/store"
import { useLocalStorage } from "../../../../../libs/controls/src/util/LocalStorageHook"
import styled from "styled-components"

const StyledDiv = styled.div`
    padding: 10px;
`

const DEFAULT_SIZE = { x: 800, y: 800, z: 800 }
const DEFAULT_ORIGIN = { x: 500, y: 0, z: 0 }

export const EnvelopeTile = () => {
    const { points, setPoints } = useEnvelopeProvider()
    const { isNearSingularity } = useKinematics(0)
    const api = useSoloActivity(0)
    const [currentPoint, setCurrentPoint] = useState(0)
    const [auto, setAuto] = useState(false)

    const [size, setSize] = useLocalStorage("size", DEFAULT_SIZE)
    const [origin, setOrigin] = useLocalStorage("origin", DEFAULT_ORIGIN)
    const [gridSize, setGridSize] = useLocalStorage("grid.size", 150)

    async function exec(n: number) {
        const { x, y, z } = points[n]
        const result = await api
            .moveInstant(x, y, z)
            .rotationEuler(-Math.PI, 0, 0)
            .frameIndex(0)
            .promise()
        if (result.completed) {
            setPoints(
                points.map((p, i) => (i === n ? { ...p, singularity: !!isNearSingularity } : p))
            )
        }
    }

    useEffect(() => {
        if (currentPoint >= 0 && currentPoint < points.length) {
            exec(currentPoint)
                .then(() => {
                    if (auto) {
                        setCurrentPoint(Math.min(currentPoint + 1, points.length - 1))
                    }
                })
                .catch(err => console.error(err))
        }
    }, [currentPoint, auto])

    useEffect(() => {
        const points = []
        for (let x = 0; x <= size.x; x += gridSize) {
            for (let y = 0; y <= size.y; y += gridSize) {
                for (let z = 0; z <= size.z; z += gridSize) {
                    // push position on the grid centered on the origin
                    points.push({
                        x: x + origin.x - size.x / 2,
                        y: y + origin.y - size.y / 2,
                        z: z + origin.z - size.z / 2
                    })
                }
            }
        }
        setPoints(points)
    }, [size, origin, gridSize])

    function toggle_auto() {
        setAuto(!auto)
        if (!auto) {
            setCurrentPoint(0)
        }
    }

    function update_size(axis: string, v: number) {
        setSize({ ...size, [axis]: v })
    }

    function update_origin(axis: string, v: number) {
        setOrigin({ ...origin, [axis]: v })
    }

    function update_grid_spacing(v: number) {
        setGridSize(v)
    }

    return (
        <StyledDiv>
            <Flex vertical gap="small">
                Grid contains {points.length} points
                <div>
                    <div>Grid Size</div>
                    <Space>
                        <PrecisionInput
                            value={size.x}
                            precision={0}
                            min={100}
                            step={50}
                            onChange={v => update_size("x", v)}
                        />
                        <PrecisionInput
                            value={size.y}
                            precision={0}
                            min={100}
                            step={50}
                            onChange={v => update_size("y", v)}
                        />
                        <PrecisionInput
                            value={size.z}
                            precision={0}
                            min={100}
                            step={50}
                            onChange={v => update_size("z", v)}
                        />
                    </Space>
                </div>
                <div>
                    <div>Grid Center</div>
                    <Space>
                        <PrecisionInput
                            value={origin.x}
                            precision={0}
                            step={50}
                            onChange={v => update_origin("x", v)}
                        />
                        <PrecisionInput
                            value={origin.y}
                            precision={0}
                            step={50}
                            onChange={v => update_origin("y", v)}
                        />
                        <PrecisionInput
                            value={origin.z}
                            precision={0}
                            step={50}
                            onChange={v => update_origin("z", v)}
                        />
                    </Space>
                </div>
                <div>
                    <div>Grid Spacing</div>
                    <Space>
                        <PrecisionInput
                            value={gridSize}
                            precision={0}
                            min={50}
                            step={25}
                            onChange={update_grid_spacing}
                        />
                    </Space>
                </div>
                <Button onClick={toggle_auto}>{auto ? "STOP" : "RUN"}</Button>
            </Flex>
        </StyledDiv>
    )
}

export const EnvelopeTileDefinition = DockTileDefinitionBuilder()
    .id("envelope")
    .name("Envelope")
    .render(() => <EnvelopeTile />)
    .enableWithoutConnection()
    .build()
