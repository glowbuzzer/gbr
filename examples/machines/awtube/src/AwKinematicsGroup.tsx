/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useJointPositions } from "@glowbuzzer/store"
import { TriadHelper } from "@glowbuzzer/controls"
import { useDhMatrix } from "../../../util/kinematics/KinChainProvider"

export const AwKinematicsGroup = ({ jointIndex, segment, children = null }) => {
    const { dh, kinematicsConfigurationIndex } = useDhMatrix()
    const jointAngle = useJointPositions(kinematicsConfigurationIndex)[jointIndex]

    const { alpha, beta, theta, a, d } = dh[jointIndex]

    const alpha_rads = (alpha * Math.PI) / 180
    const theta_rads = (theta * Math.PI) / 180

    return (
        <>
            <group rotation={[0, 0, jointAngle + theta_rads]}>
                {segment}
                <group position={[a / 1000, 0, d / 1000]} rotation={[alpha_rads, 0, 0]}>
                    {children}
                </group>
            </group>
        </>
    )
}
