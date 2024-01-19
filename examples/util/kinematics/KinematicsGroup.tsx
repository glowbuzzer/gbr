/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useDhMatrix } from "./KinChainProvider"
import { useJointPositions } from "@glowbuzzer/store"

export const KinematicsGroup = ({ jointIndex, part, children = null }) => {
    const { dh, kinematicsConfigurationIndex } = useDhMatrix()
    const jointAngle = useJointPositions(kinematicsConfigurationIndex)[jointIndex]

    const { alpha, beta, theta, a, d } = dh[jointIndex]

    const alpha_rads = (alpha * Math.PI) / 180
    const theta_rads = (theta * Math.PI) / 180

    return (
        <>
            <group rotation={[0, 0, jointAngle + theta_rads]}>
                <primitive object={part} />
                <group position={[a / 1000, 0, d / 1000]} rotation={[alpha_rads, 0, 0]}>
                    {children}
                </group>
            </group>
        </>
    )
}
