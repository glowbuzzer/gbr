/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { useJointPositions } from "@glowbuzzer/store"
import { useAwTubeKinChain } from "../AwTubeKinChainProvider"
import { TriadHelper } from "@glowbuzzer/controls"

/**
 * Component that constructs nested THREE.Group objects for a single joint plus link in the kinematics chain.
 *
 * @param jointIndex The joint being represented, used to look up the current joint angle and DH parameters
 * @param link The link to be rendered
 * @param children The children to be rendered next in the kinematics chain
 */
export const AwKinematicsGroup = ({ jointIndex, link, children = null }) => {
    // get the DH parameters and the kinematics configuration index from the context
    const { dh, kinematicsConfigurationIndex, showFrames, invJointAngles } = useAwTubeKinChain()
    // get the current joint angle from the store
    const jointAngle =
        useJointPositions(kinematicsConfigurationIndex)[jointIndex] *
        (invJointAngles[jointIndex] ? -1 : 1)

    // get the DH parameters for the joint
    const { alpha, theta, a, d } = dh[jointIndex]

    // convert the DH parameters to radians
    const alpha_rads = (alpha * Math.PI) / 180
    const theta_rads = (theta * Math.PI) / 180

    // The order of the transformations is important. We need to rotate the link first, then translate it.
    return (
        <group rotation={[0, 0, jointAngle + theta_rads]}>
            {showFrames && <TriadHelper size={0.2} />}
            {link}
            <group position={[a / 1000, 0, d / 1000]} rotation={[alpha_rads, 0, 0]}>
                {children}
            </group>
        </group>
    )
}
