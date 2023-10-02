/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useMemo } from "react"
import { DoubleSide, MeshBasicMaterial, Shape, ShapeGeometry } from "three"

export const material = new MeshBasicMaterial({
    color: 0x00ff00,
    transparent: true,
    opacity: 0.5,
    side: DoubleSide
})

/**
 * Renders a flat disk. Only used for debugging as an aid to visualisation
 * @param size
 * @constructor
 */
export const FlatDisk = ({ size }) => {
    const geometry = useMemo(() => {
        const shape = new Shape()
        shape.moveTo(0, 0)
        shape.absarc(0, 0, size, 0, Math.PI * 2, true)
        shape.lineTo(0, 0)

        return new ShapeGeometry(shape)
    }, [])

    return <mesh geometry={geometry} material={material} />
}
