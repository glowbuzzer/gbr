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
import { FramesConfig, GlowbuzzerConfig, PointsConfig } from "@glowbuzzer/store"

type ConfigLiveEditContextType = {
    points?: GlowbuzzerConfig["points"]
    frames?: GlowbuzzerConfig["frames"]

    setPoints: (points: GlowbuzzerConfig["points"]) => void
    setFrames: (frames: GlowbuzzerConfig["frames"]) => void

    clearPoints: () => void
    clearFrames: () => void
}

const ConfigLiveEditContext = createContext<ConfigLiveEditContextType | null>(null)

export const ConfigLiveEditProvider = ({ children }) => {
    const [points, setPoints] = useState<GlowbuzzerConfig["points"]>()
    const [frames, setFrames] = useState<GlowbuzzerConfig["frames"]>()

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
