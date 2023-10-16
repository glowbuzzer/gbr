/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { createContext, useContext, useState } from "react"
import { Euler, Vector3 } from "three"

export type Frame = {
    position: Vector3
    rotation: Euler
    centreOfMass: Vector3
}

type UrdfContext = {
    frames: Frame[]
    opacity: number
    showFrames: boolean
    showCentresOfMass: boolean
    setFrames(frames: Frame[]): void
    setOpacity(opacity: number): void
    setShowFrames(showFrames: boolean): void
    setShowCentresOfMass(showCentresOfMass: boolean): void
}

const UrdfContext = createContext<UrdfContext>(null)

export const UrdfContextProvider = ({ children }) => {
    const [frames, setFrames] = useState<Frame[]>([])
    const [opacity, setOpacity] = useState<number>(0.25)
    const [showFrames, setShowFrames] = useState<boolean>(true)
    const [showCentresOfMass, setShowCentresOfMass] = useState<boolean>(true)

    const context = {
        frames,
        opacity,
        showFrames,
        showCentresOfMass,
        setFrames,
        setOpacity,
        setShowFrames,
        setShowCentresOfMass
    }

    return <UrdfContext.Provider value={context}>{children}</UrdfContext.Provider>
}

export const useUrdfContext = () => {
    return useContext(UrdfContext)
}
