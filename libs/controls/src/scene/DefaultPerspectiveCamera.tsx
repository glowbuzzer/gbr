/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { PerspectiveCamera } from "@react-three/drei"
import { useScale } from "./ScaleProvider"

export const DefaultPerspectiveCamera = () => {
    const { extent } = useScale()

    return (
        <PerspectiveCamera
            makeDefault
            position={[0, 0, 3 * extent]}
            far={10000}
            near={1}
            up={[0, 0, 1]}
        />
    )
}
