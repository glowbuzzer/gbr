/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { usePoints, useSelectedPoint } from "@glowbuzzer/store"
import { Quaternion, Vector3 } from "three"
import { CartesianPositionTriadDisplay } from "./CartesianPositionTriadDisplay"
import { useConfigLiveEdit } from "../config/ConfigLiveEditProvider"

export const PointsDisplay = () => {
    const { points: editedPoints } = useConfigLiveEdit()
    const points = usePoints(editedPoints)
    const [selectedPoint, setSelectedPoint] = useSelectedPoint()

    return (
        <>
            {points.map((p, i) => {
                const { translation, rotation } = p
                const { x, y, z } = translation
                const { x: qx, y: qy, z: qz, w } = rotation

                return (
                    <CartesianPositionTriadDisplay
                        key={i}
                        name={p.name}
                        translation={new Vector3(x, y, z)}
                        rotation={new Quaternion(qx, qy, qz, w)}
                        size="small"
                        onClick={() => setSelectedPoint(i)}
                        selected={selectedPoint === i}
                    />
                )
            })}
        </>
    )
}
