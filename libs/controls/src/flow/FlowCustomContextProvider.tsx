/*
 * Copyright (c) 2024. Glowbuzzer. All rights reserved
 */

import * as React from "react"
import { createContext, useContext } from "react"

type FlowCustomContextType = {
    enabled?: boolean
    message?: string
}

const FlowCustomContext = createContext<FlowCustomContextType>(null)

type FlowCustomContextProviderProps = {
    enabled?: boolean
    message?: string
    children: React.ReactNode
}

export const FlowCustomContextProvider = ({
    children,
    enabled,
    message
}: FlowCustomContextProviderProps) => {
    return (
        <FlowCustomContext.Provider value={{ enabled, message }}>
            {children}
        </FlowCustomContext.Provider>
    )
}

export function useFlowCustomContext() {
    return useContext(FlowCustomContext) || { enabled: true, message: null }
}
