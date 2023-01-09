/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import simplify from "./simplify"
import { DynamicLine } from "./DynamicLine"
import { ToolPathElement, useFrames } from "@glowbuzzer/store"

/** @ignore - internal to the tool path tile */
export const ToolPath = ({ frameIndex, path }: { frameIndex: number; path: ToolPathElement[] }) => {
    const { convertToFrame } = useFrames()
    const pathPoints = simplify(path, 0.01)
        .map(p => convertToFrame(p, { x: 0, y: 0, z: 0, w: 1 }, frameIndex, "world").translation)
        .flatMap(p => [p.x, p.y, p.z])

    return (
        <DynamicLine
            points={pathPoints} // Array of points
            color={"red"}
            lineWidth={2} // In pixels (default)
        />
    )
}
