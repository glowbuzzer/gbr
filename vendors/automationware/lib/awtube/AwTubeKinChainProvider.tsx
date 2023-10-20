/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { createContext, useContext } from "react"
import { useKinematicsConfiguration } from "@glowbuzzer/store"

/**
 * The AwTubeKinChainContext provides the kinematic chain parameters for the robot. The values are taken from the
 * kinematics configuration that has been loaded and which will be sent to GBC.
 *
 * This context is used by the AwKinematicsGroup component to construct THREE.Group objects that
 * correctly position each link of the robot in the scene.
 *
 */

type DhMatrix = {
    alpha: number
    beta: number
    theta: number
    a: number
    d: number
}

type AwTubeKinChainContextType = {
    dh: DhMatrix[]
    invJointAngles: number[]
    showFrames?: boolean
    kinematicsConfigurationIndex: number
}

const AwTubeKinChainContext = createContext<AwTubeKinChainContextType>(null)

export const AwTubeKinChainProvider = ({
    children,
    kinematicsConfigurationIndex = 0,
    showFrames = false
}) => {
    const config = useKinematicsConfiguration(kinematicsConfigurationIndex)
    const kinChainParams = config.kinChainParams

    // currently only support 5x6 kin chain params (6-dof kins)
    if (kinChainParams.numCols !== 5 || kinChainParams.numRows !== 6) {
        throw new Error("Invalid kin chain params, expected 5 cols and six rows")
    }

    const dh: DhMatrix[] = [0, 1, 2, 3, 4, 5].map(row => {
        const [alpha, beta, theta, a, d] = kinChainParams.data.slice(row * 5, row * 5 + 5)
        if (beta !== 0) {
            throw new Error(
                "Invalid kin chain params, expected beta to be 0 (we don't support use of beta for offsets, use theta instead)"
            )
        }
        return { alpha, beta, theta, a, d }
    })

    return (
        <AwTubeKinChainContext.Provider
            value={{
                dh,
                invJointAngles: kinChainParams.invJointAngles,
                showFrames,
                kinematicsConfigurationIndex
            }}
        >
            {children}
        </AwTubeKinChainContext.Provider>
    )
}

export function useAwTubeKinChain() {
    const context = useContext(AwTubeKinChainContext)
    if (context === undefined) {
        throw new Error("useAwTubeKinChain must be used within a AwTubeKinChainProvider")
    }
    return context
}
