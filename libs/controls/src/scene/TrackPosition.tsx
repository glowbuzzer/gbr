/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { useMemo } from "react"
import {
    useFrames,
    useKinematicsCartesianPosition,
    useKinematicsConfiguration,
    useKinematicsConfigurationList
} from "@glowbuzzer/store"
import { Quaternion, Vector3 } from "three"

type TrackPositionProps = {
    kinematicsConfigurationIndex: number
    children?: React.ReactNode
}

/**
 * The TrackPosition component tracks the position of the tool in the kinematics chain and renders its children at this point in the scene.
 * For example, you can place a Frustum component inside the TrackPosition component to render a conical frustum at the tool position.
 *
 * @param kinematicsConfigurationIndex The kinematics configuration to track
 * @param children Any children to render at the tool position
 */
export const TrackPosition = ({ kinematicsConfigurationIndex, children }: TrackPositionProps) => {
    const { position } = useKinematicsCartesianPosition(kinematicsConfigurationIndex)
    const { frameIndex } = useKinematicsConfiguration(kinematicsConfigurationIndex)
    const { convertToFrame } = useFrames()

    const { p, q } = useMemo(() => {
        const { translation, rotation } = convertToFrame(
            position.translation,
            position.rotation,
            frameIndex,
            "world"
        )

        const p = new Vector3(translation.x, translation.y, translation.z)
        const q = new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)

        return { p, q }
    }, [, position, frameIndex, convertToFrame])

    return (
        <group position={p} quaternion={q}>
            {children}
        </group>
    )
}
