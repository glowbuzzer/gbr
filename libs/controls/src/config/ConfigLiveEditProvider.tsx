/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

/**
 * Provides a context containing a live edit of the configuration, which can be used to override
 * the actual config during editing to communicate changes across the front end.
 *
 * Used for live editing of points and frames.
 */

import React, { createContext, useContext, useEffect, useState } from "react"
import { FramesConfig, PointsConfig } from "@glowbuzzer/store"

type ConfigLiveEditContextType = {
    points?: PointsConfig[]
    frames?: FramesConfig[]

    setPoints: (points: PointsConfig[]) => void
    setFrames: (frames: FramesConfig[]) => void

    clearPoints: () => void
    clearFrames: () => void
}

const ConfigLiveEditContext = createContext<ConfigLiveEditContextType | null>(null)

export const ConfigLiveEditProvider = ({ children }) => {
    const [points, setPoints] = useState<PointsConfig[]>()
    const [frames, setFrames] = useState<FramesConfig[]>()

    const context = {
        points,
        frames,
        setPoints,
        setFrames,
        clearPoints: () => setPoints(undefined),
        clearFrames: () => setFrames(undefined)
    }

    return (
        <ConfigLiveEditContext.Provider value={context}>{children}</ConfigLiveEditContext.Provider>
    )
}

export const useConfigLiveEdit = () => {
    const context = useContext(ConfigLiveEditContext)
    if (!context) {
        throw new Error("useConfigLiveEdit must be used within a ConfigLiveEditProvider")
    }
    return context
}
