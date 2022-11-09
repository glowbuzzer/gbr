/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import simplify from "./simplify"
import { DynamicLine } from "./DynamicLine"
import { ToolPathElement, useFrames } from "@glowbuzzer/store"
import { Vector3, Quaternion } from "three"

/** @ignore - internal to the tool path tile */
export const ToolPath = ({ frameIndex, path }: { frameIndex: number; path: ToolPathElement[] }) => {
    const { convertToFrame } = useFrames()
    const pathPoints = simplify(path, 0.01)
        .map(
            p =>
                convertToFrame(new Vector3(p.x, p.y, p.z), new Quaternion(), frameIndex, "world")
                    .translation
        )
        .flatMap(p => [p.x, p.y, p.z])

    return (
        <DynamicLine
            points={pathPoints} // Array of points
            color={"red"}
            lineWidth={2} // In pixels (default)
        />
    )
}
