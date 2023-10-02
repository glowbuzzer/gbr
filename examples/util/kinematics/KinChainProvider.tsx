/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { DhMatrix } from "./KinChainParams"
import { createContext, useContext } from "react"
import { useKinematicsConfiguration } from "@glowbuzzer/store"

type KinChainContextType = {
    dh: DhMatrix[]
    kinematicsConfigurationIndex: number
}

const KinChainContext = createContext<KinChainContextType>(null)

export const KinChainProvider = ({ children, kinematicsConfigurationIndex = 0 }) => {
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
        <KinChainContext.Provider
            value={{
                dh,
                kinematicsConfigurationIndex
            }}
        >
            {children}
        </KinChainContext.Provider>
    )
}

export function useDhMatrix() {
    const context = useContext(KinChainContext)
    if (context === undefined) {
        throw new Error("useDhMatrix must be used within a KinChainProvider")
    }
    return context
}
