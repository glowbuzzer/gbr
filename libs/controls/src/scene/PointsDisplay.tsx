/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { PointsConfig, useFrames, usePointsList, useSelectedPoint } from "@glowbuzzer/store"
import { Quaternion, Vector3 } from "three"
import { CartesianPositionTriadDisplay } from "./CartesianPositionTriadDisplay"
import { useConfigLiveEdit } from "../config"

type PointDisplayProps = {
    point: PointsConfig
    selected: boolean
    onSelected(): void
}

const PointDisplay = ({ point, selected, onSelected }: PointDisplayProps) => {
    const { translation, rotation, frameIndex } = point
    // const { x, y, z } = translation
    // const { x: qx, y: qy, z: qz, w } = rotation

    const frames = useFrames()
    const {
        translation: { x, y, z },
        rotation: { x: qx, y: qy, z: qz, w }
    } = frames.convertToFrame(translation, rotation, frameIndex || "world", "world")

    return (
        <CartesianPositionTriadDisplay
            name={point.name}
            translation={new Vector3(x, y, z)}
            rotation={new Quaternion(qx, qy, qz, w)}
            size="small"
            selected={selected}
            onClick={onSelected}
        />
    )
}

export const PointsDisplay = () => {
    const { points: editedPoints } = useConfigLiveEdit()
    const points = usePointsList(editedPoints)
    const [selectedPoint, setSelectedPoint] = useSelectedPoint()

    return (
        <>
            {points.map((point, i) => {
                return (
                    <PointDisplay
                        key={i}
                        point={point}
                        selected={i === selectedPoint}
                        onSelected={() => setSelectedPoint(i)}
                    />
                )
            })}
        </>
    )
}
