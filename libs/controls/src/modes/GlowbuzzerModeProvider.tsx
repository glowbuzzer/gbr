/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { createContext } from "react"

type GlowbuzzerModeContextType = {
    mode: string
    setMode(mode: string): void

    modes: {
        [key: string]: {
            icon?: string | React.ReactNode
            name: string
            disabled?: boolean
        }
    }
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
            mode: "",
            setMode: () => {},
            modes: {}
        }
    }
    return context
}
