/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { createContext, Key } from "react"

type GlowbuzzerModeItem = {
    value: string | number
    icon?: string | React.ReactNode
    name: string
    disabled?: boolean
}

export type GlowbuzzerModeContextType = {
    mode: string | number
    setMode(mode: string | number): void
    modes: GlowbuzzerModeItem[]
}

const modeContext = createContext<GlowbuzzerModeContextType>(null)

type GlowbuzzerModeProviderProps = {
    children: React.ReactNode
    context: GlowbuzzerModeContextType
}

export const GlowbuzzerModeProvider = ({ children, context }: GlowbuzzerModeProviderProps) => {
    return <modeContext.Provider value={context}>{children}</modeContext.Provider>
}

export const useGlowbuzzerMode = () => {
    const context = React.useContext(modeContext)
    if (!context) {
        // return something sensible in case the context is not available
        return {
            mode: null,
            setMode: () => {},
            modes: []
        }
    }
    return context
}
