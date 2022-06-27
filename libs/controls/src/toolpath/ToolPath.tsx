/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import simplify from "./simplify"
import { DynamicLine } from "./DynamicLine"
import { ToolPathElement } from "@glowbuzzer/store"

/** @ignore - internal to the tool path tile */
export const ToolPath = ({ path }: { path: ToolPathElement[] }) => {
    const pathPoints = simplify(path, 0.01).flatMap(p => [p.x, p.y, p.z])

    return (
        <DynamicLine
            points={pathPoints} // Array of points
            color={"red"}
            lineWidth={2} // In pixels (default)
        />
    )
}
