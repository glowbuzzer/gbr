/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import simplify from "./simplify"
import { DynamicLine } from "./DynamicLine"
import { TraceElement, useFrames, useKinematicsConfiguration, useTrace } from "@glowbuzzer/store"

export const Trace = ({
    kinematicsConfigurationIndex,
    color
}: {
    kinematicsConfigurationIndex: number
    color: string
}) => {
    const { convertToFrame } = useFrames()
    const { frameIndex } = useKinematicsConfiguration(kinematicsConfigurationIndex)
    const { path } = useTrace(kinematicsConfigurationIndex)

    const pathPoints = simplify(path, 0.01)
        .map(p => convertToFrame(p, { x: 0, y: 0, z: 0, w: 1 }, frameIndex, "world").translation)
        .flatMap(p => [p.x, p.y, p.z])

    if (!pathPoints.length) {
        return null
    }

    return (
        <DynamicLine
            points={pathPoints} // Array of points
            color={color}
            lineWidth={2} // In pixels (default)
        />
    )
}
