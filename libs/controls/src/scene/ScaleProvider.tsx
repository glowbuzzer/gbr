/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React from "react"
import { useKinematicsExtents } from "@glowbuzzer/store"
import { createContext, useContext } from "react"

type ScaleContextType = {
    extent: number
    zoom: number
}

const scaleContext = createContext<ScaleContextType>(null)

type ScaleProviderProps = {
    kinematicsConfigurationIndex?: number
    children?: React.ReactNode
}

export const ScaleProvider = ({ kinematicsConfigurationIndex, children }: ScaleProviderProps) => {
    const { max } = useKinematicsExtents(kinematicsConfigurationIndex)

    const context: ScaleContextType = {
        extent: max,
        zoom: 1
    }

    return <scaleContext.Provider value={context}>{children}</scaleContext.Provider>
}

export function useScale(): ScaleContextType {
    const context = useContext(scaleContext)
    if (!context) {
        throw new Error("useScale must be used within a ScaleProvider")
    }

    return context
}
