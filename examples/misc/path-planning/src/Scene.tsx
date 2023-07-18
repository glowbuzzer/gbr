// noinspection PointlessBooleanExpressionJS

/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React, { Suspense } from "react"
import { Vector3 } from "three"
import { Line } from "@react-three/drei"
import { appSlice, useAppState } from "./store"
import { StaubliRobot } from "../../../util/StaubliRobot"
import { DefaultEnvironment } from "../../../util/DefaultEnvironment"
import { useDispatch } from "react-redux"
import { PointEditControl } from "./PointEditControl"
import { PlaneShinyMetal } from "../../../util/PlaneShinyMetal"

export const Scene = () => {
    const { box, path, clearance, plannedPath, showControls } = useAppState()
    const dispatch = useDispatch()

    const size = box.getSize(new Vector3())
    const pos = box.getCenter(new Vector3())
    const { x, y, z } = size

    const original_path_points = path.map(p => p.toArray()).flat()
    const planned_path_points = plannedPath.map(p => p.toArray()).flat()

    function update_position(position, i) {
        const new_path = path.slice()
        new_path[i] = position
        dispatch(appSlice.actions.setPath(new_path))
    }

    return (
        <group>
            <Suspense fallback={null}>
                <StaubliRobot kinematicsConfigurationIndex={0} />
            </Suspense>
            {showControls &&
                path.map((p, i) => (
                    <PointEditControl key={i} value={p} onChange={e => update_position(e, i)} />
                ))}
            <mesh position={pos}>
                <boxGeometry args={[x, y, z]} />
                <meshPhysicalMaterial
                    color={"#cccccc"}
                    envMapIntensity={0.1}
                    metalness={0.5}
                    roughness={0.5}
                />
            </mesh>
            <Line points={original_path_points} color={"#ff0000"} lineWidth={2} />
            <Line points={planned_path_points} color={"#00ff00"} lineWidth={2} />
            <DefaultEnvironment />
            <PlaneShinyMetal />
        </group>
    )
}
