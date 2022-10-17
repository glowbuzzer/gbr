/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import { useContext } from "react"
import { GlowbuzzerDockLayoutContext } from "./GlowbuzzerDockLayoutContext"
import { GlowbuzzerDockComponentDefinition } from "./GlowbuzzerDockComponentDefinition"

export function useGlowbuzzerDock() {
    return useContext(GlowbuzzerDockLayoutContext)
}

type GlowbuzzerDockComponentCurrent = Partial<GlowbuzzerDockComponentDefinition> & {
    visible: boolean
}

export function useGlowbuzzerDockComponents(): GlowbuzzerDockComponentCurrent[] {
    const { model, components } = useContext(GlowbuzzerDockLayoutContext)
    return Object.values(components).map(component => ({
        ...component,
        visible: !!model.getNodeById(component.id)
    }))
}
