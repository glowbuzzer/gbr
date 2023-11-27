/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { createContext, useContext, useState } from "react"
import { Euler, Vector3 } from "three"
import { useLocalStorage } from "../../../../../libs/controls/src/util/LocalStorageHook"

export type Frame = {
    name: string
    position: Vector3
    rotation: Euler
    centreOfMass: Vector3
    axis: Vector3
    ixx: number
    ixy: number
    ixz: number
    iyy: number
    iyz: number
    izz: number
    eigenVectors: number[][]
    principleAxes: Euler
    principleMoments: number[]
}

export type FrameOptions = {
    modelOpacity: number
    showFramesURDF: boolean
    showWorldPositionURDF: boolean
    showCentresOfMass: boolean
    showPrincipleAxesOfInertia: boolean
    showInertiaCuboid: boolean
    showWorldPositionDH: boolean
    showFramesDH: boolean
}

type UrdfContext = {
    frames: Frame[]
    options: FrameOptions
    setFrames(frames: Frame[]): void
    updateOptions(options: Partial<FrameOptions>): void
}

const UrdfContext = createContext<UrdfContext>(null)

export const UrdfContextProvider = ({ children }) => {
    const [frames, setFrames] = useState<Frame[]>([])
    const [options, setOptions] = useState<FrameOptions>({
        modelOpacity: 1,
        showFramesURDF: true,
        showWorldPositionURDF: true,
        showCentresOfMass: true,
        showPrincipleAxesOfInertia: false,
        showInertiaCuboid: false,
        showWorldPositionDH: false,
        showFramesDH: false
    })

    const context = {
        frames,
        options,
        setFrames,
        updateOptions: (options: Partial<FrameOptions>) => {
            setOptions(current => ({ ...current, ...options }))
        }
    }

    return <UrdfContext.Provider value={context}>{children}</UrdfContext.Provider>
}

export const useUrdfContext = () => {
    return useContext(UrdfContext)
}
