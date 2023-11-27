/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import { GlowbuzzerConfig } from "@glowbuzzer/store"
import { createContext, ReactNode, useContext, useMemo, useState } from "react"
import { config_awtube_l, config_awtube_l2 } from "../config"
import {
    AwTubeRobotParts,
    Base,
    Clamp,
    Joint,
    Link,
    Monobraccio,
    Plate,
    Spindle
} from "@automationware/awtube"

export enum AwTubeModel {
    AWTUBE_L = "awtube-l",
    AWTUBE_L2 = "awtube-l2"
}

type ModelContextType = {
    config: GlowbuzzerConfig
    model: AwTubeModel
    parts: AwTubeRobotParts
    changeModel: (model: AwTubeModel) => void
}

const ModelContext = createContext<ModelContextType>(null)

const definition_l2: AwTubeRobotParts = {
    b0: Base.MM219,
    j0: Joint.J40LP,
    p0: Plate.J40,
    c0: Clamp.J40_J40,
    j1: Joint.J40HP,
    l0: Link.L125_314,
    j2: Joint.J32,
    c1: Clamp.J32_J25,
    j3: Joint.J25,
    p1: Plate.J25,
    l1: Link.L100_294,
    j4: Joint.J25,
    p2: Plate.J25,
    m0: Monobraccio.M220,
    j5: Joint.J20,
    s0: Spindle.M112
}

const definition_l: AwTubeRobotParts = {
    b0: Base.MM219,
    j0: Joint.J40LP,
    p0: Plate.J40,
    c0: Clamp.J40_J40,
    j1: Joint.J40HP,
    l0: Link.L125_514,
    j2: Joint.J32,
    c1: Clamp.J32_J25,
    j3: Joint.J25,
    p1: Plate.J25,
    l1: Link.L100_494,
    j4: Joint.J25,
    p2: Plate.J25,
    m0: Monobraccio.M220,
    j5: Joint.J20,
    s0: Spindle.M112
}

export const ModelProvider = ({ children }: { children: ReactNode }) => {
    const [model, setModel] = useState(AwTubeModel.AWTUBE_L)

    function changeModel(model: AwTubeModel) {
        setModel(model)
    }

    const context = useMemo(() => {
        return {
            model,
            config: model === AwTubeModel.AWTUBE_L ? config_awtube_l : config_awtube_l2,
            parts: model === AwTubeModel.AWTUBE_L ? definition_l : definition_l2,
            changeModel
        }
    }, [model])

    return <ModelContext.Provider value={context}>{children}</ModelContext.Provider>
}

export function useAwTubeModel() {
    return useContext(ModelContext)
}
