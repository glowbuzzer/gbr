// noinspection PointlessBooleanExpressionJS

/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import React, { Suspense } from "react"
import { Box3, Event, Line3, Vector3 } from "three"
import { Line, TransformControls } from "@react-three/drei"
import { BoxPlanes } from "./BoxPlanes"
import { avoid, faces } from "./planning"
import { appSlice, useAppState } from "./store"
import { StaubliRobot } from "../../../util/StaubliRobot"
import { DefaultEnvironment } from "../../../util/DefaultEnvironment"
import { usePointsList } from "@glowbuzzer/store"
import { useDispatch } from "react-redux"
import { PointEditControl } from "./PointEditControl"

const line_z = 0

export const Scene = () => {
    const { box, path, clearance, showControls } = useAppState()
    const dispatch = useDispatch()

    const size = box.getSize(new Vector3())
    const pos = box.getCenter(new Vector3())
    const { x, y, z } = size

    // const start = new Vector3(0, -40, line_z)
    // const end = new Vector3(0, 40, line_z)

    const points_array = path.map(p => p.toArray()).flat()

    const moves = path.slice(1).map((p, i) => {
        return [path[i], p]
    })

    const lines = moves
        .map(([p1, p2]) => {
            return avoid(box, p1, p2, clearance)
        })
        .flat()

    const new_line = lines.map(p => p.toArray()).flat()

    // const colors = ["#F08080", "#87CEEB", "#90EE90", "#FFD700", "#D8BFD8", "#FFA07A"]

    function update_position(position, i) {
        // const zero = new Vector3()
        // if (e.target.worldPosition.equals(zero)) {
        //     return
        // }
        const new_path = path.slice()
        new_path[i] = position
        dispatch(appSlice.actions.setPath(new_path))
        // console.log("update_position", e.target.worldPosition)
    }

    return (
        <group>
            <Suspense fallback={null}>
                <StaubliRobot kinematicsConfigurationIndex={0} />
            </Suspense>
            {/*
            <BoxPlanes box3={box} colors={colors} />
*/}
            {showControls &&
                path.map((p, i) => (
                    <PointEditControl
                        key={i}
                        value={p}
                        // mode={"translate"}
                        onChange={e => update_position(e, i)}
                        // onMouseUp={e => update_position(e, i)}
                    />
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
            <Line points={points_array} color={"#ff0000"} lineWidth={2} />
            <Line points={new_line} color={"#00ff00"} lineWidth={2} />
            <DefaultEnvironment />
        </group>
    )
}
