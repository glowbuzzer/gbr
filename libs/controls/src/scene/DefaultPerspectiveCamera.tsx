/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { PerspectiveCamera } from "@react-three/drei"
import { useScale } from "./ScaleProvider"
import { Vector3 } from "three"
import { useMemo } from "react"

export const DefaultPerspectiveCamera = ({ position = undefined }) => {
    const { extent } = useScale()
    const initialPosition = useMemo(
        () => position || new Vector3(0, 0, extent * 2),
        [extent, position]
    )
    return (
        <PerspectiveCamera
            makeDefault
            position={initialPosition}
            far={10000}
            near={1}
            up={[0, 0, 1]}
        />
    )
}
